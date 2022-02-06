import * as React from 'react'

export const FORMATS = {
  vinyl: { title: 'Vinyl', match: ['LP', 'EP', '12"'] },
  cd: { title: 'CD', match: ['CD'] },
  cassette: { title: 'Cassette', match: ['Cass'] },
}

const Filter = ({ filters, setFilters, legend, filterName, values }) => {
  const currentValue = filters?.[filterName]

  const items = [{ title: 'all', value: 'all' }, ...values].map(
    ({ value, title }) => {
      const highlighted =
        currentValue === value || (value === 'all' && !currentValue)
      const classes = highlighted ? 'underline' : ''

      return (
        <div key={value}>
          <button
            className={`${classes} lowercase`}
            id={value}
            style={{ fontFamily: 'Oswald' }} // TODO clean this up
            onClick={() => {
              setFilters((filters) => ({
                ...filters,
                [filterName]: value !== 'all' ? value : null,
              }))
            }}
          >
            {title}
          </button>
          <label className="hidden" htmlFor={value}>
            {title}
          </label>
        </div>
      )
    }
  )

  return (
    <fieldset className="pt-10 text-4xl">
      <div className="flex flex-row">
        <legend
          className="uppercase"
          style={{
            fontFamily: 'Oswald', // TODO clean this up
          }}
        >
          {legend}
        </legend>
        <div className="flex flex-grow gap-10 justify-end">{items}</div>
      </div>
    </fieldset>
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

// Handle no or few results TODO
//
// Use a Regex to filter entries
// + exclude terms (CD, LP -> matches vinyl but shouldnt)
const Filters = ({ data, filters, setFilters }) => {
  return (
    <div className="pb-20 bg-gray-300">
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

export default Filters
