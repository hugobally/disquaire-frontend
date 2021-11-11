import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'

const OversizedListingItem = ({ listing, image }) => {
  const { release, note } = listing

  return (
    <div className="row-span-2 col-span-2 relative">
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.description}`}
      />
      <div>
        <span className="rounded bg-white h-1/3 p-3 rotate-3 shadow-2xl top-0 transform w-1/2 z-20 absolute">
          {note}
        </span>
      </div>
    </div>
  )
}

const ListingItem = ({ listing, image }) => {
  const { release } = listing
  return (
    <div>
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.description}`}
      />
    </div>
  )
}

// Import image via a component so the build fails if not found / Or use URL ? TODO
const IndexPage = ({ data }) => {
  const listingItems = data.allListing.nodes.map((listing) => {
    const { localImage, note } = listing

    const image = getImage(localImage)
    if (!image) return null

    return note ? (
      <OversizedListingItem {...{ listing, image }} />
    ) : (
      <ListingItem {...{ listing, image }} />
    )
  })

  return (
    <>
      <header>
        <div className="flex place-content-center">
          <StaticImage
            src="../images/ajna-records-logo-500x500.jpg"
            alt="Ajna Records"
            width={200}
            height={200}
          />
        </div>
      </header>
      <main
        className="grid
          grid-cols-auto-fit
          grid-flow-row-dense
          place-items-center
          gap-10
          max-w-7xl
          mx-auto
          px-10"
      >
        {listingItems}
      </main>
    </>
  )
}

// Load big size only for oversized images
export const query = graphql`
  {
    allListing {
      nodes {
        id
        release {
          artist
          description
        }
        note
        localImage {
          childImageSharp {
            gatsbyImageData(
              width: 600
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
