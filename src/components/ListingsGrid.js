import ListingsGridItem from './ListingsGridItem'
import React, { useMemo } from 'react'
import { getImage } from 'gatsby-plugin-image'
import classNames from 'classnames'

const ListingsGrid = ({ listings }) => {
  const itemsToRender = useMemo(() => {
    listings.forEach((listing) => (listing.picked = false))

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
      className={classNames(
        'gap-2 px-10 sm:gap-10',
        'sm:place-items-center',
        'sm:grid sm:grid-flow-row-dense sm:auto-rows-fr sm:auto-rows-auto',
        'sm:grid-cols-2 sm:grid-cols-auto-fit',
      )}
    >
      {itemsToRender}
    </div>
  )
}

export default ListingsGrid
