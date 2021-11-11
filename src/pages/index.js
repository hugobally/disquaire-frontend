import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'

const ListingItem = ({ listing, index }) => {
  const { release, localImage } = listing

  const image = getImage(localImage)

  if (!image) return null

  const className = index % 5 === 0 ? 'row-span-2 col-span-2' : ''

  return (
    <div className={className}>
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.description}`}
      />
    </div>
  )
}

// Import image via a component so the build fails if not found / Or use URL ? TODO
const IndexPage = ({ data }) => {
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
        {data.allListing.nodes.map((listing, index) => (
          <ListingItem key={listing.id} listing={listing} index={index} />
        ))}
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
