import ListingsGridItem from './ListingsGridItem'
import React, { useMemo } from 'react'
import { getImage } from 'gatsby-plugin-image'
import classNames from 'classnames'

const ListingsGrid = ({ listings }) => {
  const itemsToRender = useMemo(() => {
    if (listings.length === 0) return []

    const intervals = [ 4, 8 ]
    let interval = intervals[0]
    let intervalIndex = 0

    const listingsWithNotes = listings.filter(({ note }) => note)
    const firstListing = listingsWithNotes.shift()
    const listingsWithoutNotes = listings.filter(({ note }) => !note)

    const orderedListings = Array(listings.length - 1)
      .fill({})
      .map(() => {
        if (listingsWithNotes.length && interval === 0) {
          intervalIndex =
            intervalIndex + 1 < intervals.length ? intervalIndex + 1 : 0
          interval = intervals[intervalIndex]
          return listingsWithNotes.shift()
        }

        interval = interval - 1
        return listingsWithoutNotes.shift() || listingsWithoutNotes.shift()
      })

    orderedListings.unshift(firstListing || listingsWithoutNotes[0])

    return orderedListings.map((listing) => {
      const { id, localImage } = listing

      const image = getImage(localImage)
      if (!image) return null

      return <ListingsGridItem key={id} listing={listing} image={image} />
    })
  }, [listings])

  return (
    <div
      className={classNames(
        'gap-2 px-10 sm:gap-10',
        'sm:place-items-center',
        'sm:grid sm:grid-flow-row-dense sm:auto-rows-fr sm:auto-rows-auto',
        'sm:grid-cols-auto-fit md:grid-cols-3 lg:grid-cols-5'
      )}
    >
      {itemsToRender}
    </div>
  )
}

export default ListingsGrid
