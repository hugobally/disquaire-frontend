import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

// Handle no image TODO
const ListingItem = ({ listing }) => {
  const { release, localImage } = listing

  const image = getImage(localImage)

  if (!image) return null

  return (
    <div>
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.description}`}
      />
    </div>
  )
}

const IndexPage = ({ data }) => {
  return (
    <div className="grid ">
      {data.allListing.nodes.map((listing) => (
        <ListingItem key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

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
              width: 200
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
