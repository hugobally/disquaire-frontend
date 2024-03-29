const https = require('https')
const http = require('http')
const qs = require('qs')

const showdown = require('showdown'),
  markdownConverter = new showdown.Converter()
const DOMPurify = require('isomorphic-dompurify')

const { createRemoteFileNode } = require('gatsby-source-filesystem')

const uniq = require('lodash/uniq')
const { uniqBy } = require('lodash')
const { omit } = require('lodash/object')

const {
  DISCOGS_KEY,
  DISCOGS_SECRET,
  DISCOGS_USERNAME,
  CMS_HOSTNAME,
  CMS_PORT,
  CMS_API_TOKEN,
} = process.env

// Only create the necessary fields TODO
// Improve the preprocessing with https://www.gatsbyjs.com/docs/how-to/images-and-media/preprocessing-external-images/ TODO
// For some reason the primary image in the array is not as good as the one on the discogs page of the release TODO
// Check the robustness of the build in case of request failures TODO
// Split CMS and Discogs in separate plugins TODO
exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
  createNodeId,
}) => {
  if (
    !DISCOGS_KEY ||
    !DISCOGS_SECRET ||
    !DISCOGS_USERNAME ||
    !CMS_HOSTNAME ||
    !CMS_API_TOKEN
  ) {
    throw new Error(
      'Missing environment variables, check .env.example for more info'
    )
  }

  console.log('-- DISCOGS AND CMS PLUGIN -- Starting')

  const listingsFromDiscogs = uniqBy(
    await fetchDiscogsListings(),
    (listing) => listing.release.id
  ).filter(({ release }) => Boolean(release.images[0]?.uri))

  console.log(
    `-- DISCOGS AND CMS PLUGIN -- ${listingsFromDiscogs.length} Discogs listings after filters`
  )

  const listingsFromCMS = await fetchCMSListings()

  const populatedListings = listingsFromCMS
    .map(
      ({
        attributes: {
          discogs_listing_id,
          moods: { data: moods },
          note,
        },
      }) => {
        const matchingDiscogsListing = listingsFromDiscogs.find(
          ({ id }) => id === Number(discogs_listing_id)
        )
        if (!matchingDiscogsListing) return null

        return {
          ...matchingDiscogsListing,
          moods: moods.map((mood) => mood.attributes.name),
          note: parseMarkdown(note),
        }
      }
    )
    .filter((listing) => Boolean(listing))

  const listingsToCreate = populatedListings.concat(
    listingsFromDiscogs.filter(
      ({ id }) =>
        !populatedListings.some(
          ({ id: populatedListingId }) => id === populatedListingId
        )
    )
  )

  const formatArtistName = (artist) => artist.replaceAll(/\s*\(\d+\)/g, '')

  listingsToCreate
    .map((listing) => ({
      id: listing.id,
      release: {
        artist: formatArtistName(listing.release.artist),
        title: listing.release.title,
        artistAndTitle: `${formatArtistName(listing.release.artist)} - ${
          listing.release.title
        }`,
        format: listing.release.format,
        description: listing.release.description,
        imageUrl: listing.release.images[0].uri,
      },
      note: listing.note,
      moods: listing.moods,
      price: {
        value: listing.price.value,
      },
      condition: listing.condition,
      comments: listing.comments,
      seller: {
        shipping: listing.seller.shipping,
        payment: listing.seller.payment,
      },
      posted: listing.posted,
    }))
    .forEach((listing) => {
      createNode({
        ...listing,
        id: createNodeId(`Listing-${listing.id}`),
        internal: {
          type: 'Listing',
          contentDigest: createContentDigest(listing),
        },
      })
    })

  const moods = uniq(populatedListings.map(({ moods }) => moods).flat())

  moods.forEach((mood) => {
    createNode({
      value: mood,
      id: createNodeId(`Mood-${mood}`),
      internal: {
        type: 'Mood',
        contentDigest: createContentDigest(mood),
      },
    })
  })

  const { introText, shippingInfo, contactURLArray } = await fetchCMSSingleTypes()
  createNode({
    content: introText,
    id: createNodeId(`IntroText`),
    internal: {
      type: 'IntroText',
      contentDigest: createContentDigest(introText),
    },
  })
  createNode({
    content: shippingInfo,
    id: createNodeId(`ShippingInfo`),
    internal: {
      type: 'ShippingInfo',
      contentDigest: createContentDigest(shippingInfo),
    },
  })
  contactURLArray.forEach((contactURL) =>
    createNode({
      ...contactURL,
      id: createNodeId(`ContactUrl-${contactURL.name}`),
      internal: {
        type: 'ContactUrl',
        contentDigest: createContentDigest(contactURL),
      },
    })
  )

  const bands = await fetchCMSBands()
  bands
    .map(({ id, name, url, image }) => ({
      id,
      name,
      url,
      imageUrl: image.data?.attributes.formats.small?.url || image.data?.attributes.formats.thumbnail?.url,
    }))
    .forEach((band) => {
      createNode({
        ...band,
        id: createNodeId(`Band-${band.id}`),
        internal: {
          type: 'Band',
          contentDigest: createContentDigest(band),
        },
      })
    })

  console.log(`-- DISCOGS PLUGIN -- All done`)
}

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  cache,
  store,
}) => {
  if (node.internal.type === 'Listing') {
    const fileNode = await createRemoteFileNode({
      url: node.release.imageUrl,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store,
    })
    if (fileNode) {
      createNodeField({ node, name: 'localImage', value: fileNode.id })
    }
  }

  if (node.internal.type === 'Band' && node.imageUrl) {
    const fileNode = await createRemoteFileNode({
      url: node.imageUrl,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store,
    })
    if (fileNode) {
      createNodeField({ node, name: 'localImage', value: fileNode.id })
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Listing implements Node {
      localImage: File @link(from: "fields.localImage")
      
      note: String
      moods: [String!]
    }
    
    type Mood implements Node {
      value: String!
    }
    
    type Band implements Node {
      localImage: File @link(from: "fields.localImage")
      url: String
    }
    
    type ContactUrl implements Node {
      name: String
      url: String
    }
  `)
}

async function fetchDiscogsListings() {
  const allPages = (await fetchAllPages(fetchDiscogsInventoryPage))
    .map((page) => page.listings)
    .flat()

  console.log(
    `-- DISCOGS PLUGIN -- Fetched ${allPages.length} listings from Discogs`
  )

  return allPages
}

function fetchDiscogsInventoryPage(page = 1) {
  const options = {
    hostname: 'api.discogs.com',
    port: 443,
    path: `/users/${DISCOGS_USERNAME}/inventory?page=${page}&per_page=50`,
    method: 'GET',
    headers: {
      'User-Agent': 'Script',
      Authorization: `Discogs key=${DISCOGS_KEY}, secret=${DISCOGS_SECRET}`,
    },
  }

  return performRequest(
    options,
    (response) => {
      const responseFromJSON = JSON.parse(response)
      return {
        ...responseFromJSON,
        numPages: responseFromJSON.pagination.pages,
      }
    },
    true
  )
}

async function fetchCMSListings() {
  const allPages = (
    await fetchAllPages(
      fetchCMSPage('listings', { fields: ['discogs_listing_id', 'note'] })
    )
  )
    .map(({ data }) => data)
    .flat()

  const filtered = allPages.filter(
    ({ attributes: { moods, note } }) => moods.data.length || note
  )

  console.log(
    `-- DISCOGS PLUGIN -- Fetched ${allPages.length} listings from CMS (${
      allPages.length - filtered.length
    } filtered out)`
  )

  return filtered
}

async function fetchCMSBands() {
  const allPages = (await fetchAllPages(fetchCMSPage('bands')))
    .map(({ data }) => data)
    .flat()
    .map((band) => ({ id: band.id, ...band.attributes }))

  console.log(`-- DISCOGS PLUGIN -- Fetched ${allPages.length} bands from CMS`)

  return allPages
}

async function fetchCMSSingleTypes() {
  const introTextResponse = await fetchCMSPage('intro-text-content')()
  const shippingInfoResponse = await fetchCMSPage('shipping-info')()
  const contactURLResponse = await fetchCMSPage('contact-url')()
  const contactURLArray = contactURLResponse.error ? [] : Object.keys(
    omit(contactURLResponse.data.attributes, 'createdAt', 'updatedAt')
  ).map((key) => ({ name: key, url: contactURLResponse.data.attributes[key] }))
  console.log(contactURLArray)

  return {
    introText: introTextResponse.error
      ? "Replace this using the Introduction Text field of the CMS. (Don't forget to publish !)"
      : parseMarkdown(introTextResponse.data.attributes.content),
    shippingInfo: shippingInfoResponse.error
      ? "Replace this using the Introduction Text field of the CMS. (Don't forget to publish !)"
      : parseMarkdown(shippingInfoResponse.data.attributes.content),
    contactURLArray,
  }
}

const fetchCMSPage =
  (endpoint, params = {}) =>
  (page = 1) => {
    const query = qs.stringify(
      {
        pagination: {
          pageSize: 50,
          page: page,
        },
        publicationState: 'live',
        populate: '*',
        ...params,
      },
      {
        encodeValuesOnly: true,
      }
    )

    const options = {
      hostname: CMS_HOSTNAME,
      port: CMS_PORT,
      path: `/api/${endpoint}?${query}`,
      method: 'GET',
      headers:
        process.env.NODE_ENV !== 'development'
          ? {
              Authorization: `bearer ${CMS_API_TOKEN}`,
            }
          : {},
    }

    return performRequest(
      options,
      (response) => {
        const responseFromJSON = JSON.parse(response)

        return {
          ...responseFromJSON,
          numPages: responseFromJSON.meta?.pagination?.pageCount,
        }
      },
      process.env.NODE_ENV !== 'development'
    )
  }

async function fetchAllPages(fetchOnePage) {
  const firstPage = await fetchOnePage(1)

  const extraPagePromises = []
  for (let i = 2; i <= firstPage.numPages; i++) {
    extraPagePromises.push(fetchOnePage(i))
  }
  const extraPages = await Promise.all(extraPagePromises)

  return [firstPage, ...extraPages]
}

function performRequest(options, responseParser, ssl = true) {
  return new Promise((resolve, reject) => {
    const req = (ssl ? https : http).request(options, (res) => {
      let response = ''

      res.on('data', (d) => {
        response += d
      })

      res.on('close', () => {
        resolve(responseParser(response))
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}

const parseMarkdown = (markdown) =>
  DOMPurify.sanitize(markdownConverter.makeHtml(markdown))
