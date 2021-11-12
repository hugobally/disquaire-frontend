import * as React from 'react'
import { graphql } from 'gatsby'

const Listing = () => <span>WIP</span>

export const query = graphql`
  query ($id: String) {
    listing(id: { eq: $id }) {
      id
      release {
        artist
        title
        description
      }
      note
      localImage {
        childImageSharp {
          gatsbyImageData(
            width: 450
            height: 450
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
  }
`

export default Listing
