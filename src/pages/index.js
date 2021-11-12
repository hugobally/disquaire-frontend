import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'

// Use gatsby prebuilt layout stuff to prevent unmounting/rerenders on page change TODO
const IndexPage = ({ data }) => {
  return (
    <>
      <header>
        <div className="flex place-content-center">
          {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
          <StaticImage
            src="../images/ajna-records-logo-500x500.jpg"
            alt="Ajna Records"
            width={200}
            height={200}
          />
        </div>
      </header>
      <main>
        <ListingGrid listings={data.allListing.nodes} />
      </main>
    </>
  )
}

const ListingGrid = ({ listings}) => {
  listings.forEach((listing) => listing.picked = false)

  const itemsToRender = Array(listings.length).fill({})
    .map((_, index) => {
      let item
      if (index % 5 === 0) {
        item = listings.find(({ note, picked }) => note && !picked)
      }
      if (!item) {
        item = listings.find(({ picked }) => !picked)
      }
      item.picked = true
      return item
    })
    .map((listing) => {
      const { id, localImage, note } = listing

      const image = getImage(localImage)
      if (!image) return null

      return note ? (
        <OversizedListingItem key={id} {...{ listing, image }} />
      ) : (
        <ListingGridItem key={id} {...{ listing, image }} />
      )
    })

  return (
    <div className="grid grid-cols-auto-fit grid-flow-row-dense place-items-center gap-10 max-w-7xl mx-auto px-10">
      {itemsToRender}
    </div>
  )
}

const ListingGridItem = ({ listing, image }) => {
  const { release } = listing
  return (
    <article>
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.title}`}
      />
    </article>
  )
}

const OversizedListingItem = ({ listing, image }) => {
  const { release, note } = listing

  return (
    <article className="row-span-2 col-span-2 relative">
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.description}`}
      />
      <div>
        <span className="rounded bg-white h-1/3 p-3 rotate-3 shadow-2xl top-0 transform w-1/2 z-20 absolute">
          {note}
        </span>
      </div>
    </article>
  )
}

// Load big size only for oversized images TODO
export const query = graphql`
  {
    allListing {
      nodes {
        id
        release {
          artist
          title
        }
        note
        localImage {
          childImageSharp {
            gatsbyImageData(
              width: 450
              height:450
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`

export default IndexPage
