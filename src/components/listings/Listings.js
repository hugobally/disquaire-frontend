import React, { useMemo, useState } from 'react'
import Filters, { applyFilters } from './Filters'
import ListingsGrid from './ListingsGrid'
import { graphql, useStaticQuery } from 'gatsby'

const Listings = () => {
  const [filters, setFilters] = useState()

  // Load big size only for oversized images TODO
  const data = useStaticQuery(
    graphql`
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
  )

  const listings = useMemo(
    () => applyFilters({ listings: data.allListing.nodes, filters }),
    [filters, data]
  )

  return (
    <div>
      <Filters {...{ data, filters, setFilters }} />
      <ListingsGrid listings={listings} filters={filters} />
    </div>
  )
}

export default Listings