const http = require('http')
const https = require('https')
const qs = require('qs')

const chunk = require('lodash/chunk')
const uniq = require('lodash/uniq')

const { createRemoteFileNode } = require('gatsby-source-filesystem')

const { DISCOGS_KEY, DISCOGS_SECRET, DISCOGS_USERNAME, CMS_URL, CMS_PORT } =
  process.env

const LISTING_NODE_TYPE = 'Listing'
const MOOD_NODE_TYPE = 'Mood'

// Only create the necessary fields TODO
// Improve the preprocessing with https://www.gatsbyjs.com/docs/how-to/images-and-media/preprocessing-external-images/ TODO
// For some reason the primary image in the array is not as good as the one on the discogs page of the release TODO
exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  if (!DISCOGS_KEY || !DISCOGS_SECRET || !DISCOGS_USERNAME) {
    throw new Error(
      'Missing environment variables when reading ./.env, check .env.example for more info'
    )
  }

  const { createNode } = actions

  const listingsFromDiscogs = await fetchDiscogsListings()
  const listingsFromCMS = await fetchCMSListings()

  const populatedListings = listingsFromCMS.map(
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
      return {
        ...matchingDiscogsListing,
        moods: moods.map((mood) => mood.attributes.name),
        note,
      }
    }
  )

  const nodesToCreate = populatedListings.concat(
    listingsFromDiscogs.filter(
      ({ id }) =>
        !populatedListings.some(
          ({ id: populatedListingId }) => id === populatedListingId
        )
    )
  )

  nodesToCreate.forEach((listing) => {
    createNode({
      ...listing,
      id: createNodeId(`${LISTING_NODE_TYPE}-${listing.id}`),
      internal: {
        type: LISTING_NODE_TYPE,
        contentDigest: createContentDigest(listing),
      },
    })
  })

  const allMoods = uniq(populatedListings.map(({ moods }) => moods).flat())

  allMoods.forEach((mood) => {
    createNode({
      value: mood,
      id: createNodeId(`${MOOD_NODE_TYPE}-${mood}`),
      internal: {
        type: MOOD_NODE_TYPE,
        contentDigest: createContentDigest(mood),
      },
    })
  })
}

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  cache,
  store,
}) => {
  if (node.internal.type === LISTING_NODE_TYPE) {
    const imgUrl = node.release.images[0]?.uri

    const fileNode = await createRemoteFileNode({
      url: imgUrl,
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
    }
  `)
}

// Not robust in case of request failure TODO
async function fetchDiscogsListings() {
  const allPages = await fetchAllPages(fetchDiscogsInventoryPage)

  return allPages
    .map((page) => page.listings)
    .flat()
    .filter(({ release }) => Boolean(release.images[0]?.uri))
    .map((listing) => ({
      ...listing,
      release: {
        ...listing.release,
        artistAndTitle: `${listing.release.artist} - ${listing.release.title}`,
      },
    }))
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
  const allPages = await fetchAllPages(
    fetchCMSPage('listings', { fields: ['discogs_listing_id', 'note'] })
  )

  return allPages
    .map(({ data }) => data)
    .flat()
    .filter(({ attributes: { moods, note } }) => moods.data.length || note)
}

const fetchCMSPage =
  (endpoint, params = {}) =>
  (page) => {
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
        encodeValuesOnly: true, // prettify URL
      }
    )

    console.log(`${CMS_URL}:${CMS_PORT}/api/${endpoint}?${query}`)

    const options = {
      hostname: CMS_URL,
      port: CMS_PORT,
      path: `/api/${endpoint}?${query}`,
      method: 'GET',
    }

    return performRequest(
      options,
      (response) => {
        const responseFromJSON = JSON.parse(response)

        return {
          ...responseFromJSON,
          numPages: responseFromJSON.meta.pagination.pageCount,
        }
      },
      false
    )
  }

async function fetchAllPages(fetchOnePage) {
  const firstPage = await fetchOnePage()

  const extraPagePromises = []
  for (let i = 2; i <= firstPage.numPages; i++) {
    extraPagePromises.push(fetchOnePage(i))
  }
  const extraPages = await Promise.all(extraPagePromises)

  return [firstPage, ...extraPages]
}

function performRequest(options, responseParser, ssl = false) {
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
