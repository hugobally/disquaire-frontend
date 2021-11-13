import * as React from 'react'
import { useMemo, useState } from 'react'
import { graphql } from 'gatsby'
import Layout from 'src/components/Layout'
import ListingGrid from 'src/components/ListingGrid'
import Filters, { applyFilters } from 'src/components/Filters'

// Use gatsby prebuilt layout stuff to prevent unmounting/rerenders on page change TODO
const IndexPage = ({ data }) => {
  const [filters, setFilters] = useState()

  const listings = useMemo(
    () => applyFilters({ listings: data.allListing.nodes, filters }),
    [filters, data]
  )

  return (
    <Layout>
      <main>
        <Filters {...{ data, filters, setFilters }} />
        <ListingGrid listings={listings} filters={filters} />
      </main>
    </Layout>
  )
}

// Load big size only for oversized images TODO
export const query = graphql`
  {
    allListing(sort: { order: DESC, fields: posted }) {
      nodes {
        id
        release {
          artist
          title
          format
        }
        note
        mood
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
        listingPath: gatsbyPath(
          filePath: "/listings/{Listing.release__artistAndTitle}"
        )
      }
    }

    allMood {
      nodes {
        value
      }
    }
  }
`

export default IndexPage
