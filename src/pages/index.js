import * as React from 'react'
import { useMemo, useState } from 'react'
import { graphql } from 'gatsby'
import Layout from 'src/components/Layout'
import ListingGrid from 'src/components/ListingGrid'
import Filter from 'src/components/Filter'

const FORMATS = {
  vinyl: { title: 'Vinyl', match: ['LP', 'EP', '12\"'] },
  cd: { title: 'CD', match: ['CD'] },
  cassette: { title: 'Cassette', match: ['Cass'] },
}

// Use gatsby prebuilt layout stuff to prevent unmounting/rerenders on page change TODO
const IndexPage = ({ data }) => {
  const [filters, setFilters] = useState()

  const listings = useMemo(() => {
    if (!filters) return data.allListing.nodes

    const allFormatsMatcher = Object.values(FORMATS)
      .map(({ match }) => match)
      .flat()

    return data.allListing.nodes.filter((listing) => {
      if (filters.mood && listing.mood !== filters.mood) return false
      if (filters.format) {
        if (filters.format === 'other') {
          return !allFormatsMatcher.some((string) =>
            listing.release.format.includes(string)
          )
        } else {
          return FORMATS[filters.format].match?.some((string) =>
            listing.release.format.includes(string)
          )
        }
      }

      return true
    })
  }, [filters, data])

  return (
    <Layout>
      <main>
        <Filter
          filterName="mood"
          legend="moods"
          values={data.allMood.nodes.map(({ value }) => ({
            title: value,
            value,
          }))}
          filters={filters}
          setFilters={setFilters}
        />
        <Filter
          filterName="format"
          legend="formats"
          values={[
            ...Object.entries(FORMATS).map(([value, { title }]) => ({
              title,
              value,
            })),
            {
              title: 'other',
              value: 'other',
            },
          ]}
          filters={filters}
          setFilters={setFilters}
        />
        <ListingGrid listings={listings} filters={filters} />
      </main>
    </Layout>
  )
}

// Load big size only for oversized images TODO
export const query = graphql`
  {
    allListing(sort: { order: DESC, fields: posted }) {
      nodes {
        id
        release {
          artist
          title
          format
        }
        note
        mood
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
        listingPath: gatsbyPath(
          filePath: "/listings/{Listing.release__artistAndTitle}"
        )
      }
    }

    allMood {
      nodes {
        value
      }
    }
  }
`

export default IndexPage
