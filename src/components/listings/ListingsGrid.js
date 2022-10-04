import * as React from 'react'
import { useMemo } from 'react'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

const ListingsGrid = ({ listings }) => {
    const itemsToRender = useMemo(() => {
        listings.forEach((listing) => (listing.picked = false))

        // both options can be offloaded to the backend

        // Option A - random
        let interval = 5
        const getRandomIntInclusive = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
        }

        // Option B - Interval depending on total amount of total listings
        // Looks better but needs a good ratio of withNotes
        // const withNotesCount = listings.filter(({ note }) => note).length
        // const interval = Math.ceil(listings.length / withNotesCount)

        return Array(listings.length)
            .fill({})
            .map((_, index) => {
                let item
                if (index % interval === 0) {
                    item = listings.find(({ note, picked }) => note && !picked)

                    // Option A - random
                    interval = getRandomIntInclusive(3, 5)
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

                return (
                    <ListingsGridItem
                        key={id}
                        listing={listing}
                        image={image}
                    />
                )
            })
    }, [listings])

    return (
        <div
            className="sm:grid sm:grid-cols-2 sm:auto-rows-fr sm:grid-flow-row-dense sm:place-items-center sm:gap-2 px-4
          sm:grid-cols-auto-fit sm:auto-rows-auto sm:gap-10 sm:px-0"
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
        note ? 'row-span-2 col-span-2 h-full w-full flex flex-col relative sm:justify-center sm:items-center' : ''
      } `}
    >
      <div className={`${note ? 'mx-auto w-2/3 sm:w-auto' : ''}`}>
        <Link to={listingPath}>
        <GatsbyImage
          image={image}
          alt={`${release.artist} ${release.description}`}
        />
        </Link>
      </div>
      {note && (
        <div>
          <span className="sm:rounded sm:bg-white sm:h-1/3 sm:p-3 sm:rotate-3 sm:shadow-2xl sm:top-0 sm:transform sm:w-1/2 sm:z-20 sm:absolute">
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

export default ListingsGrid
