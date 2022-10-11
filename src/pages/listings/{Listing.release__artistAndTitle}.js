import * as React from 'react'
import { graphql, Link } from "gatsby";
import Page from 'src/components/Page'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { useEffect, useRef } from 'react'
import classNames from "classnames";

const Listing = ({ data }) => {
  const { localImage, release, note, seller, price } = data.listing
  const image = getImage(localImage)

  const listingRef = useRef(null)

  useEffect(() => {
    listingRef.current.scrollIntoView()
  }, [])

  return (
    <Page>
      <div className="min-h-screen rounded-t-2xl bg-white" ref={listingRef}>
        <div className="flex flex-col xl:flex-row">
          <Link to="/" className={classNames('whitespace-nowrap mx-auto mt-4 sm:mt-10 text-3xl')}>
            {"< Back"}
          </Link>
          <div className="flex justify-center p-10 xl:w-1/2 xl:justify-end xl:p-20">
            <div>
              <GatsbyImage
                image={image}
                alt={`${release.artist} ${release.description}`}
                width={450}
                height={450}
              />
            </div>
          </div>
          <div className="prose prose-sm flex flex-col px-10 sm:prose lg:prose-lg xl:prose-xl xl:w-1/2 xl:p-20">
            <h2>{release.title}</h2>
            <h3>{release.artist}</h3>
            <span>Price: {price.value} €</span>
            <span>Format: {release.format}</span>
            <div dangerouslySetInnerHTML={{ __html: data.allShippingInfo.nodes[0].content }} ></div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export const query = graphql`
  query ($id: String) {
    listing(id: { eq: $id }) {
      id
      release {
        artist
        title
        description
      }
      note
      localImage {
        childImageSharp {
          gatsbyImageData(
            width: 450
            height: 450
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
      price {
        value
      }
      condition
      comments
      release {
        format
      }
      seller {
        shipping
        payment
      }
    }

    allShippingInfo {
      nodes {
        content
      }
    }
  }
`

export default Listing
