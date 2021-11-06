const https = require('https')

const DISCOGS_KEY = process.env.DISCOGS_KEY
const DISCOGS_SECRET = process.env.DISCOGS_SECRET

// Not robust in case of request failure TODO

const fetchInventoryPage = (page = 1) =>
  new Promise((resolve, reject) => {
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

const fetchInventory = async () => {
  try {
    const firstPage = await fetchInventoryPage()
    const numPages = firstPage.pagination.pages

    const extraPagePromises = []
    for (let i = 2; i <= numPages; i++) {
      extraPagePromises.push(fetchInventoryPage(i))
    }
    const extraPages = await Promise.all(extraPagePromises)

    return [firstPage, ...extraPages].map((page) => page?.listings).flat()
  } catch (error) {
    console.log(error)
  }
}

const run = async () => {
  const inventory = await fetchInventory()
  console.log(
    JSON.stringify(inventory.map((listing) => listing?.release?.description))
  )
  console.log(inventory.map((listing) => listing?.release?.description).length)
}

run()
