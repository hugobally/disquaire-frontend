import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

// Handle no image TODO
const ListingItem = ({ listing }) => {
  const { release, localImage } = listing

  const image = getImage(localImage)
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
    <div class="grid">
      {data.allListing.nodes.map((listing) => (
        <ListingItem listing={listing} />
      ))}
    </div>
  )
}

export const query = graphql`
  {
    allListing(limit: 20) {
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
