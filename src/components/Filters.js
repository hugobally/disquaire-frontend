import * as React from 'react'
import Filter from 'src/components/Filter'

export const FORMATS = {
  vinyl: { title: 'Vinyl', match: ['LP', 'EP', '12\"'] },
  cd: { title: 'CD', match: ['CD'] },
  cassette: { title: 'Cassette', match: ['Cass'] },
}

// Handle no or few results TODO
const Filters = ({ data, filters, setFilters }) => {
  return (
    <div className="pb-20">
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
    </div>
  )
}

export const applyFilters = ({ listings, filters }) => {
  if (!filters) return listings

  const allFormatsMatcher = Object.values(FORMATS)
    .map(({ match }) => match)
    .flat()

  return listings.filter((listing) => {
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
}

export default Filters
