import * as React from 'react'
import {useState} from 'react'

export const FORMATS = {
  vinyl: { title: 'Vinyl', match: ['LP', 'EP', '12"'] },
  cd: { title: 'CD', match: ['CD'] },
  cassette: { title: 'Cassette', match: ['Cass'] },
}

const Filter = ({ filters, setFilters, legend, filterName, values, mobileCurrentFilterModal, setMobileCurrentFilterModal }) => {
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
          <label className="sr-only" htmlFor={value}>
            {title}
          </label>
        </div>
      )
    }
  )

  return (
    <fieldset className="text-4xl">
      <div className="flex flex-row">
        <legend
          className="relative"
          style={{
            fontFamily: 'Oswald', // TODO clean this up
          }}
        >
          {legend}
          <button onClick={() => {setMobileCurrentFilterModal()}} className="absolute w-full h-full top-0 left-0 sm:hidden"/>
        </legend>
        <div className="sr-only flex flex-grow gap-10 justify-end">{items}</div>
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
  const [mobileCurrentFilterModal, setMobileCurrentFilterModal] = useState(null)

  return (
    <div className="sticky flex flex-row justify-between top-0 my-10 bg-red-500 z-10">
      <Filter
        filterName="mood"
        legend="moods"
        values={data.allMood.nodes.map(({ value }) => ({
          title: value,
          value,
        }))}
        {...{filters, setFilters, mobileCurrentFilterModal, setMobileCurrentFilterModal }}
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
        {...{filters, setFilters, mobileCurrentFilterModal, setMobileCurrentFilterModal }}
      />
    </div>
  )
}

export default Filters
