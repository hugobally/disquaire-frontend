import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import * as DOMPurify from 'dompurify'
import classNames from 'classnames'

const ListingsGridItem = ({ listing, image }) => {
  const { note, listingPath, release } = listing

  return (
    <article
      className={`relative mt-4 sm:mt-0 sm:transform sm:transition sm:hover:scale-110
      ${
        note
          ? 'col-span-2 row-span-2 flex h-full w-full flex-col sm:items-center sm:justify-center'
          : ''
      } `}
    >
      <div
        className={classNames('flex flex-col', {
          'mx-auto w-2/3 sm:w-auto': note,
        })}
      >
        <Link to={`${listingPath}?from_grid=true`}>
          <GatsbyImage
            image={image}
            alt={`${release.artist} ${release.description}`}
            className="rounded-md"
          />
        </Link>
        {/*<span*/}
        {/*  className={classNames(*/}
        {/*    'sm:absolute',*/}
        {/*    'bg-black text-white',*/}
        {/*    'bottom-0 w-full rounded-b-md p-2',*/}
        {/*    { 'w-450px': note }*/}
        {/*  )}*/}
        {/*>*/}
        {/*  {`${release.artist} - ${release.title}`}*/}
        {/*</span>*/}
      </div>
      {note && (
        <Link to={`${listingPath}?from_grid=true`}>
          <span
            className="sm:absolute sm:top-0 sm:z-20 sm:h-1/3 sm:w-1/2 sm:rotate-3 sm:transform sm:rounded sm:bg-black sm:bg-opacity-95 sm:p-3 sm:text-white sm:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note) }}
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
