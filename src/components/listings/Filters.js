import * as React from 'react'
import { useState } from 'react'
import classNames from 'classnames'

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
  color,
  displayedFilterModal,
  setDisplayedFilterModal,
}) => {
  const currentValue = filters?.[filterName]

  return (
    <fieldset
      className={classNames('text-2xl flex-1', {
        'sr-only': displayedFilterModal && filterName !== displayedFilterModal,
      })}
    >
      <div className={`flex flex-col sm:flex-row ${color} rounded-b-lg`}>
        <legend
          className="relative p-2"
          style={{
            fontFamily: 'Oswald', // TODO clean this up
          }}
        >
          {legend}{`➜${currentValue || 'all'}`}
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
          className={classNames(
            'flex flex-col sm:not-sr-only sm:flex-grow sm:justify-end sm:gap-10',
            {
              'h-screen': filterName === displayedFilterModal,
              'sr-only': filterName !== displayedFilterModal,
            }
          )}
        >
          {[{ title: 'all', value: 'all' }, ...values].map(
            ({ value, title }) => {
              const highlighted =
                currentValue === value || (value === 'all' && !currentValue)
              const classes = highlighted ? 'underline' : ''

              return (
                <div key={value} className="p-2 bg-black text-white">
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
    <div
      className={classNames('top-0 z-10 w-full', {
        'fixed overflow-scroll overscroll-contain': displayedFilterModal,
        'sticky': !displayedFilterModal,
      })}
    >
      <div
        className={classNames('flex', {
          'align-start flex-col overflow-scroll overscroll-contain': displayedFilterModal,
          'flex-row items-center sm:justify-between': !displayedFilterModal,
        })}
      >
        <Filter
          filterName="mood"
          legend="mood"
          values={data.allMood.nodes.map(({ value }) => ({
            title: value,
            value,
          }))}
          color="bg-black text-white"
          {...{
            filters,
            setFilters,
            displayedFilterModal,
            setDisplayedFilterModal,
          }}
        />
        <Filter
          filterName="format"
          legend="format"
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
          color="bg-black text-white"
          {...{
            filters,
            setFilters,
            displayedFilterModal,
            setDisplayedFilterModal,
          }}
        />
      </div>
    </div>
  )
}

export default Filters
