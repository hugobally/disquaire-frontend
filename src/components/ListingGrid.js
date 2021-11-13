import * as React from 'react'
import { useMemo } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

const ListingGrid = ({ listings }) => {
  const itemsToRender = useMemo(() => {
    listings.forEach((listing) => (listing.picked = false))

    return Array(listings.length)
      .fill({})
      .map((_, index) => {
        let item
        if (index % 5 === 0) {
          item = listings.find(({ note, picked }) => note && !picked)
        }
        if (!item) {
          item = listings.find(({ picked }) => !picked)
        }
        item.picked = true
        return item
      })
      .map((listing) => {
        const { id, localImage, listingPath, note } = listing

        const image = getImage(localImage)
        if (!image) return null

        const classNames = note ? 'row-span-2 col-span-2 relative' : ''

        return (
          <article
            key={id}
            className={`${classNames} transform transition hover:scale-110`}
          >
            <Link to={listingPath}>
              <ListingGridItem listing={listing} image={image} />
            </Link>
          </article>
        )
      })
  }, [listings])

  return (
    <div className="grid grid-cols-auto-fit grid-flow-row-dense place-items-center gap-10">
      {itemsToRender}
    </div>
  )
}

const ListingGridItem = ({ listing, image }) => {
  const { note, release } = listing
  return (
    <>
      <GatsbyImage
        image={image}
        alt={`${release.artist} ${release.description}`}
      />
      {note && (
        <div>
          <span className="rounded bg-white h-1/3 p-3 rotate-3 shadow-2xl top-0 transform w-1/2 z-20 absolute">
            {note}
          </span>
        </div>
      )}
    </>
  )
}

export default ListingGrid
