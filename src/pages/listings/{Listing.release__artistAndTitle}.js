import * as React from 'react'
import { graphql } from 'gatsby'
import Page from 'src/components/Page'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const Listing = ({ data }) => {
  const { localImage, release, note, seller, price } = data.listing
  const image = getImage(localImage)

  return (
    <Page>
      <div className="flex flex-col xl:flex-row">
        <div className="flex justify-center p-10 xl:p-20 xl:justify-end xl:w-1/2">
          <div>
            <GatsbyImage
              image={image}
              alt={`${release.artist} ${release.description}`}
              width={450}
              height={450}
            />
          </div>
        </div>
        <main className="flex flex-col prose prose-sm sm:prose lg:prose-lg xl:prose-xl px-10 xl:p-20 xl:w-1/2">
          <h2>{release.title}</h2>
          <h3>{release.artist}</h3>
          <span>Price: {price.value} €</span>
          <span>Format: {release.format}</span>
          <p>{seller.shipping}</p>
          <p>{seller.payment}</p>
        </main>
      </div>
    </Page>
  )
}

// <table>
//   <tbody>
//   <tr>
//     <td>Price</td>
//     <td>{price.value} €</td>
//   </tr>
//   <tr>
//     <td>Format</td>
//     <td>{release.format}</td>
//   </tr>
//   </tbody>
// </table>

// Structure for full height page
//
//   <div className="flex flex-row h-full">
//     <div className="w-1/2 flex">
//       <div className="flex">
//         ...
//       </div>
//     </div>
//     <main className="w-1/2 flex">
//       ...
//     </main>
//   </div>

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
  }
`

export default Listing
