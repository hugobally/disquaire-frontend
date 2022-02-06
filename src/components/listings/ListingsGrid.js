import * as React from 'react'
import { useMemo } from 'react'
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

const ListingsGridItem = ({ listing, image }) => {
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

const ListingsGrid = ({ listings }) => {
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
              <ListingsGridItem listing={listing} image={image} />
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
