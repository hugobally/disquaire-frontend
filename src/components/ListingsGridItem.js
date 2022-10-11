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
      <div>
        <Link
          to={`${listingPath}?from_grid=true`}
          className={classNames('relative flex flex-col')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <GatsbyImage
            image={image}
            alt={`${release.artist} ${release.description}`}
            className="sm:rounded-md"
          />
          <span
            className={classNames(
              'sm:absolute',
              'bg-black text-white',
              'bottom-0 w-full p-2 transition-opacity',
              {
                'sm:invisible sm:opacity-0 ': !isHovered,
                'sm:visible sm:opacity-100': isHovered,
                'rounded-b-md': !note,
                'rounded-none sm:rounded-b-md': note,
              }
            )}
          >
            {`${release.artist} - ${release.title}`}
          </span>
        </Link>
      </div>
      {note && (
        <Link
          to={`${listingPath}?from_grid=true`}
          className={classNames('rounded-b-lg bg-black sm:rounded-b-none')}
        >
          <div
            className={classNames(
              'text-white',
              'p-3 sm:p-3',
              'sm:absolute sm:top-0 sm:text-base',
              'sm:z-20 sm:w-1/2 sm:rotate-3 sm:transform sm:rounded',
              'sm:bg-black sm:bg-opacity-95 sm:shadow-2xl'
            )}
            dangerouslySetInnerHTML={{ __html: note }}
          />
        </Link>
      )}
    </article>
  )
}

export default ListingsGridItem
