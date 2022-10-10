import React, { useState } from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import classNames from 'classnames'

const ListingsGridItem = ({ listing, image }) => {
  const { note, listingPath, release } = listing
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className={`relative mt-4 sm:mt-0 sm:transition sm:hover:scale-110
      ${
        note
          ? 'col-span-2 row-span-2 flex h-full w-full flex-col sm:items-center sm:justify-center'
          : ''
      } `}
    >
      <div className={classNames('relative flex flex-col')}>
        <Link
          to={`${listingPath}?from_grid=true`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <GatsbyImage
            image={image}
            alt={`${release.artist} ${release.description}`}
            className="rounded-md"
          />
        </Link>
        <span
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classNames(
            'sm:absolute',
            'bg-black text-white',
            'bottom-0 w-full rounded-b-md p-2 transition-opacity',
            {
              // 'w-450px': note,
              'sm:invisible sm:opacity-0 ': !isHovered,
              'sm:visible sm:opacity-100': isHovered,
            }
          )}
        >
          {`${release.artist} - ${release.title}`}
        </span>
      </div>
      {note && (
        <Link to={`${listingPath}?from_grid=true`}>
          <span
            className="sm:absolute sm:top-0 sm:z-20 sm:w-1/2 sm:rotate-3 sm:transform sm:rounded sm:bg-black sm:bg-opacity-95 sm:p-3 sm:text-white sm:shadow-2xl sm:text-md"
            dangerouslySetInnerHTML={{ __html: note }}
          />
        </Link>
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

export default ListingsGridItem
