const https = require('https')

const _ = require('lodash')

const { createRemoteFileNode } = require('gatsby-source-filesystem')

const DISCOGS_KEY = process.env.DISCOGS_KEY
const DISCOGS_SECRET = process.env.DISCOGS_SECRET

const LISTING_NODE_TYPE = 'Listing'

// Only create the necessary fields TODO
// Improve the preprocessing with https://www.gatsbyjs.com/docs/how-to/images-and-media/preprocessing-external-images/ TODO
// For some reason the primary image in the array is not as good as the one on the discogs page of the release TODO
// Don't create nodes if there's no image, or handle no images
exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  // getNodesByType,
}) => {
  const { createNode } = actions

  const data = await fetchInventory()

  const moods = ['atmospheric', 'raw', 'noise', 'classics', 'miscellaneous']
  const notes = [
    "Cet album vous ramènera l'être aimé, la gloire et la fortune.",
    "L'univers entier distillé en 45 minutes de musique, vous finirez scotché au plafond",
    'Un classique de la musique de chambre enfin réédité',
    "Ma grand-mère l'écoute tous les jours au petit déjeuner, soyez comme ma grand-mère",
    "Un chef-d'oeuvre !",
  ]

  const chunks = _.chunk(data, data.length / moods.length)

  chunks
    .map((chunk, index) =>
      chunk.map((listing) => ({
        ...listing,
        mood: moods?.[index] || moods[0],
        release: {
          ...listing.release,
          artistAndTitle: `${listing.release.artist} - ${listing.release.title}`,
        },
      }))
    )
    .flat()
    .map((listing, index) =>
      index % 5 === 0
        ? {
            ...listing,
            note: notes[Math.floor(Math.random() * notes.length)],
          }
        : listing
    )
    .forEach((listing) => {
      createNode({
        ...listing,
        id: createNodeId(`${LISTING_NODE_TYPE}-${listing.id}`),
        internal: {
          type: LISTING_NODE_TYPE,
          content: JSON.stringify(listing),
          contentDigest: createContentDigest(listing),
        },
        parent: null,
        children: [],
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

    if (!imgUrl) return

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

    // createNodeField({ node, name: 'slug', value: `${node.release.artist} ${node.release.title}`})
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
async function fetchInventory() {
  const firstPage = await fetchInventoryPage()
  const numPages = firstPage.pagination.pages

  const extraPagePromises = []
  for (let i = 2; i <= numPages; i++) {
    extraPagePromises.push(fetchInventoryPage(i))
  }
  const extraPages = await Promise.all(extraPagePromises)

  return [firstPage, ...extraPages].map((page) => page?.listings).flat()
}

function fetchInventoryPage(page = 1) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.discogs.com',
      port: 443,
      path: `/users/Ajna.Records/inventory?page=${page}&per_page=50`,
      method: 'GET',
      headers: {
        'User-Agent': 'Script for Ajna Records',
        Authorization: `Discogs key=${DISCOGS_KEY}, secret=${DISCOGS_SECRET}`,
      },
    }

    const req = https.request(options, (res) => {
      let response = ''

      res.on('data', (d) => {
        response += d
      })

      res.on('close', () => {
        const inventory = JSON.parse(response)
        resolve(inventory)
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}
