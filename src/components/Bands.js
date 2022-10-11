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
        'rounded-3xl',
        'flex flex-col justify-center',
        'bg-gray-50 mb-10 shadow-inner'
      )}
    >
      <h1 className="p-2 pt-14 text-center text-5xl uppercase sm:h-auto sm:px-10">
        Bands
      </h1>
      <ul
        className={classNames(
          'gap-2 p-10 sm:gap-4',
          'sm:place-items-center justify-center',
          'grid sm:grid-flow-row-dense sm:auto-rows-fr sm:auto-rows-auto sm:grid-cols-auto-fit'
        )}
      >
        {bands.map(({ id, name, url, localImage }) => {
          const image = getImage(localImage)

          return (
            <li key={id} className="w-48 sm:hover:scale-110 sm:transition">
              <Link
                to={url}
                className="hover:bg-white hover:bg-opacity-10"
              >
                {image ? (
                  <div style={{ display: 'grid' }}>
                    <GatsbyImage
                      image={image}
                      alt={''}
                      style={{
                        gridArea: '1/1',
                      }}
                      layout="constrained"
                      className="rounded-lg shadow-md"
                    />
                    <div
                      style={{
                        gridArea: '1/1',
                        position: 'relative',
                        placeItems: 'center',
                        display: 'grid',
                      }}
                    >
                      <span className="text-3xl bg-white p-1 rounded-sm shadow">{name}</span>
                    </div>
                  </div>
                ) : <span className="text-3xl p-1">{name}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Bands
