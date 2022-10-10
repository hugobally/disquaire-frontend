import React, { useMemo, useRef, useState } from 'react'
import Filters, { applyFilters } from './Filters'
import { graphql, useStaticQuery, Link } from 'gatsby'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'
import ListingsGrid from "./ListingsGrid";

const Listings = () => {
  const [filterValues, setFilterValues] = useState()

  const listingsTopAnchor = useRef(null)

  // Load big size only for oversized images TODO
  const data = useStaticQuery(graphql`
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
          moods
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
  `)

  const unfilteredListings = useMemo(() => data.allListing.nodes, [data])
  const listings = useMemo(
    () => applyFilters(unfilteredListings, filterValues),
    [unfilteredListings, filterValues]
  )

  return (
    <>
      <div className="bg-gray-100 shadow-inner rounded-md">
        <div
          className="w-full p-2 pt-14 text-center text-5xl
                        sm:h-auto sm:px-10"
        >
          SHOP
        </div>
        <div ref={listingsTopAnchor} />
        <Filters {...{ data, filterValues, setFilterValues, unfilteredListings, listingsTopAnchor }} />
        <div className="mt-10 min-h-screen">
          {listings.length ? (
            <ListingsGrid listings={listings} />
          ) : (
            <div className="relative">
              <div className="flex justify-center opacity-50">
                <StaticImage
                  src="../images/crate-300x300.png"
                  alt="no results"
                  width={400}
                  height={400}
                  placeholder="tracedSVG"
                />
              </div>
              <div className="absolute top-1/2 flex w-full justify-center">
                <span className="rounded-l bg-white p-2 text-4xl">
                  No results !
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Listings
