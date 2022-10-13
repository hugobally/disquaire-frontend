import React, { useMemo } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import classNames from 'classnames'

const Bands = () => {
  const data = useStaticQuery(graphql`
    {
      allBand {
        nodes {
          id
          name
          url
          localImage {
            childImageSharp {
              gatsbyImageData(
                width: 200
                height: 200
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
      }
    }
  `)

  const bands = useMemo(() => data.allBand.nodes, [data])

  // TODO Factorize Grid component
  return (
    <section
      className={classNames(
        'mx-auto',
        'rounded-lg',
        'flex flex-col justify-center',
        'mb-10 bg-gray-50 shadow-inner'
      )}
    >
      <h1 className="p-2 pt-14 text-center text-5xl uppercase sm:h-auto sm:px-10">
        Bands
      </h1>
      <ul
        className={classNames(
          'gap-2 p-10 sm:gap-4',
          'justify-center sm:place-items-center',
          'grid sm:grid-flow-row-dense sm:auto-rows-fr sm:auto-rows-auto sm:grid-cols-auto-fit'
        )}
      >
        {bands.map(({ id, name, url, localImage }) => {
          const image = getImage(localImage)

          return (
            <li key={id} className="w-48 sm:transition sm:hover:scale-110">
              <Link to={url} className="hover:bg-white hover:bg-opacity-10">
                {image || true ? (
                  <div style={{ display: 'grid' }}>
                    <GatsbyImage
                      image={image}
                      style={{
                        gridArea: '1/1',
                      }}
                      layout="constrained"
                      className="rounded-lg shadow-md"
                      alt={''}
                    />
                    <div
                      style={{
                        gridArea: '1/1',
                        position: 'relative',
                        placeItems: 'center',
                        display: 'grid',
                      }}
                    >
                      <span className="rounded-sm bg-white p-1 text-3xl shadow">
                        {name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="p-1 text-3xl">{name}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Bands
