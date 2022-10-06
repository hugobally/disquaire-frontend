import React, { useMemo, useState } from 'react'
import Filters, { applyFilters } from './Filters'
import { graphql, useStaticQuery, Link } from 'gatsby'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'

const Listings = () => {
  const [filters, setFilters] = useState()

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

  const listings = useMemo(
    () => applyFilters({ listings: data.allListing.nodes, filters }),
    [filters, data]
  )

  return (
    <>
      <div className="rounded-t-full bg-white">
        <div
          className="h-50vw w-full rounded-t-full p-2 pt-14 text-center text-5xl
                        sm:h-auto sm:px-10 sm:pt-32"
        >
          BANDS
        </div>
        <div
          className="w-full rounded-t-full p-2 pt-14 text-center text-5xl
                        sm:h-auto sm:px-10 sm:pt-32"
        >
          THE DISTRO
        </div>
        <Filters {...{ data, filters, setFilters }} />
        <ListingsGrid listings={listings} className="mt-10 min-h-screen" />
      </div>
    </>
  )
}

const ListingsGrid = ({ listings, className }) => {
  const itemsToRender = useMemo(() => {
    listings.forEach((listing) => (listing.picked = false))

    // both options can be offloaded to the backend

    // Option A - random
    // let interval = 5
    // const getRandomIntInclusive = (min, max) => {
    //     min = Math.ceil(min)
    //     max = Math.floor(max)
    //     return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
    // }

    // Option B - seed
    const initialIntervals = [
      3, 4, 3, 5, 4, 3, 4, 5, 3, 3, 5, 5, 5, 5, 4, 5, 5, 5, 3, 3, 5, 3, 3, 3, 4,
      5, 3, 5, 5, 5, 3, 4, 5, 3, 3, 3, 5, 3, 3, 5, 5, 3, 3, 3, 3, 5, 3, 4, 3, 5,
    ]
    let intervals = [...initialIntervals]
    let interval = intervals[0]

    return Array(listings.length)
      .fill({})
      .map((_, index) => {
        let item
        if (index % interval === 0) {
          item = listings.find(({ note, picked }) => note && !picked)

          // Option A - random
          // interval = getRandomIntInclusive(3, 5)
          // Option B - seed
          if (intervals.length === 0) intervals.concat([...initialIntervals])
          interval = intervals.shift()
        }
        if (!item) {
          item = listings.find(({ picked }) => !picked)
        }
        item.picked = true
        return item
      })
      .map((listing) => {
        const { id, localImage } = listing

        const image = getImage(localImage)
        if (!image) return null

        return <ListingsGridItem key={id} listing={listing} image={image} />
      })
  }, [listings])

  return (
    <div
      className={`gap-2 px-10 sm:grid sm:grid-flow-row-dense sm:auto-rows-fr
          sm:auto-rows-auto sm:grid-cols-2 sm:grid-cols-auto-fit sm:place-items-center sm:gap-10 ${className}`}
    >
      {itemsToRender}
    </div>
  )
}

const ListingsGridItem = ({ listing, image }) => {
  const { note, listingPath, release } = listing

  return (
    <article
      className={`mt-4 sm:mt-0 sm:transform sm:transition sm:hover:scale-110
      ${
        note
          ? 'relative col-span-2 row-span-2 flex h-full w-full flex-col sm:items-center sm:justify-center'
          : ''
      } `}
    >
      <div className={`${note ? 'mx-auto w-2/3 sm:w-auto' : ''}`}>
        <Link to={`${listingPath}?from_grid=true`}>
          <GatsbyImage
            image={image}
            alt={`${release.artist} ${release.description}`}
          />
        </Link>
      </div>
      {note && (
        <div>
          <span className="sm:absolute sm:top-0 sm:z-20 sm:h-1/3 sm:w-1/2 sm:rotate-3 sm:transform sm:rounded sm:bg-white sm:p-3 sm:shadow-2xl">
            {note}
          </span>
        </div>
      )}
    </article>
  )
}

// <div className="absolute top-0 grid w-60 rotate-3 shadow-lg">
//   <StaticImage
//     src="../images/old-yellowed-crinkled-paper-texture.jpg"
//     alt="Post-it note background"
//     style={{ gridArea: '1/1', height: 200, width: 200 }}
//   ></StaticImage>
//   <div
//     className=""
//     style={{
//       // By using the same grid area for both, they are stacked on top of each other
//       gridArea: '1/1',
//       position: 'relative',
//       // This centers the other elements inside the hero component
//       placeItems: 'center',
//       display: 'grid',
//         //
//         fontFamily: 'Homemade Apple'
//     }}
//   >
//     {note}
//   </div>

export default Listings
