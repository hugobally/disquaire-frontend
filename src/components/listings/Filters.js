import * as React from 'react'
import { useContext, useState } from 'react'

export const FORMATS = {
  vinyl: { title: 'Vinyl', match: ['LP', 'EP', '12"'] },
  cd: { title: 'CD', match: ['CD'] },
  cassette: { title: 'Cassette', match: ['Cass'] },
}

const Filter = ({
  filters,
  setFilters,
  legend,
  filterName,
  values,
  displayedFilterModal,
  setDisplayedFilterModal,
}) => {
  const currentValue = filters?.[filterName]

  return (
    <fieldset className="text-4xl">
      <div className="flex flex-col sm:flex-row">
        <legend
          className="relative"
          style={{
            fontFamily: 'Oswald', // TODO clean this up
          }}
        >
          {legend}
          <button
            onClick={() => {
              setDisplayedFilterModal(
                displayedFilterModal === filterName ? null : filterName
              )
            }}
            className="absolute top-0 left-0 h-full w-full sm:hidden"
          />
        </legend>
        <div
          className={`${displayedFilterModal !== filterName ? 'sr-only' : ''} 
          overflow-scroll h-screen flex flex-col flex-grow justify-end gap-10 sm:not-sr-only`}
        >
          {[{ title: 'all', value: 'all' }, ...values, { title: 'test', value: 'test'}, { title: 'test', value: 'test'},{ title: 'test', value: 'test'},{ title: 'test', value: 'test'},{ title: 'test', value: 'test'},{ title: 'test', value: 'test'},].map(
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
                      setDisplayedFilterModal(null)
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
          )}
        </div>
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
  const [displayedFilterModal, setDisplayedFilterModal] = useState()

  return (
    <div className="sticky top-0 z-10 my-10 flex flex-row justify-between bg-red-500">
      <Filter
        filterName="mood"
        legend="moods"
        values={data.allMood.nodes.map(({ value }) => ({
          title: value,
          value,
        }))}
        {...{
          filters,
          setFilters,
          displayedFilterModal,
          setDisplayedFilterModal,
        }}
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
        {...{
          filters,
          setFilters,
          displayedFilterModal,
          setDisplayedFilterModal,
        }}
      />
    </div>
  )
}

export default Filters
