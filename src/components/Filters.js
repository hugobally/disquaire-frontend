import * as React from 'react'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { without } from 'lodash'

export const FORMATS = {
  vinyl: { title: 'Vinyl', matchers: [] }, // By default, if we don't match another format, it's a vinyl.
  cd: { title: 'CD', matchers: ['CD'] },
  cassette: { title: 'Cassette', matchers: ['Cass'] },
}

const Filters = ({
  data,
  filterValues,
  setFilterValues,
  unfilteredListings,
  listingsTopAnchor,
}) => {
  const [mobileModal, setMobileModal] = useState()

  const filters = useMemo(
    () => [
      {
        name: 'format',
        choices: Object.entries(FORMATS).map(([value, { title }]) => ({
          title,
          value,
        })),
        matcher: formatFilter,
      },
      {
        name: 'mood',
        choices: data.allMood.nodes.map(({ value }) => ({
          title: value,
          value,
        })),
        matcher: moodFilter,
      },
    ],
    [data]
  )

  return (
    <div
      className={classNames(
        'top-2 z-10 m-3 sm:mx-10 sm:mt-8 sm:w-auto sm:p-2',
        {
          sticky: !mobileModal,
          'fixed overflow-scroll overscroll-contain': mobileModal,
        }
      )}
    >
      <div
        className={classNames('flex', {
          'flex-row items-center sm:flex-col sm:items-center sm:justify-between sm:gap-3':
            !mobileModal,
          'align-start flex-col overflow-scroll overscroll-contain':
            mobileModal,
        })}
      >
        {filters
          .filter(({ choices }) => choices.length > 1)
          .map(({ name, choices, matcher }) => (
            <Filter
              key={name}
              filterName={name}
              legend={name}
              {...{
                choices,
                filterValues,
                setFilterValues,
                mobileModal,
                setMobileModal,
                listingsTopAnchor,
                unfilteredListings,
                filterFunction: matcher,
              }}
            />
          ))}
      </div>
    </div>
  )
}

const Filter = ({
  choices,
  filterValues,
  setFilterValues,
  legend,
  filterName,
  mobileModal,
  setMobileModal,
  listingsTopAnchor,
  unfilteredListings,
}) => {
  const currentValue = filterValues?.[filterName]

  const displayedChoices = useMemo(
    () => [
      { title: 'all', value: 'all' },
      ...choices.map((choice) => ({
        ...choice,
        disabled: !applyFilters(unfilteredListings, {
          ...filterValues,
          [filterName]: choice.value,
        }).length,
      })),
    ],
    [choices, unfilteredListings, filterValues, setFilterValues, filterName]
  )

  return (
    <div
      className={classNames(
        `flex-1 rounded-lg bg-black text-base sm:bg-white sm:shadow-inner sm:text-lg`,
        {
          'sr-only': mobileModal && filterName !== mobileModal,
        }
      )}
    >
      <div className="flex flex-col sm:m-1 sm:flex-row">
        <legend
          className="relative rounded-sm p-2 text-white  sm:sr-only sm:text-black"
          style={{ fontFamily: 'Oswald' }} // TODO Remove this somehow
        >
          {legend}
          <button
            onClick={() => {
              setMobileModal(mobileModal === filterName ? null : filterName)
            }}
            className="absolute top-0 left-0 h-full w-full sm:hidden"
          />
        </legend>
        <div
          className={classNames(
            'flex flex-col sm:not-sr-only sm:flex-grow sm:flex-row sm:gap-0.5',
            {
              'h-screen': filterName === mobileModal,
              'sr-only': filterName !== mobileModal,
            }
          )}
        >
          {displayedChoices.map(({ value, title, disabled }) => {
            const highlighted =
              currentValue === value || (value === 'all' && !currentValue)

            return (
              <div
                key={value}
                className="bg-black text-white sm:bg-white sm:text-black"
              >
                <button
                  className={classNames(
                    'rounded-md p-2 lowercase',
                    'sm:transition-colors sm:hover:bg-black sm:hover:text-white',
                    'disabled:opacity-50',
                    {
                      'sm:bg-black sm:text-white': highlighted,
                    }
                  )}
                  id={value}
                  style={{ fontFamily: 'Oswald' }} // TODO Remove this
                  onClick={() => {
                    setFilterValues((filterValues) => ({
                      ...filterValues,
                      [filterName]: value !== 'all' ? value : null,
                    }))
                    setMobileModal(null)
                    setTimeout(
                      () =>
                        listingsTopAnchor.current.scrollIntoView({
                          behavior: 'smooth',
                        }),
                      50
                    )
                  }}
                  disabled={disabled}
                >
                  {title}
                </button>
                <label className="sr-only" htmlFor={value}>
                  {title}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const applyFilters = (listings, filterValues) => {
  if (!filterValues) return listings

  return listings.filter((listing) => {
    if (filterValues.mood && !moodFilter(filterValues.mood, listing)) {
      return false
    }

    if (filterValues.format && !formatFilter(filterValues.format, listing)) {
      return false
    }

    return true
  })
}

const isMatch = (value, listing) => listing.release.format.includes(value)

const formatFilter = (filterValue, listing) =>
  filterValue === 'vinyl'
    ? !without(Object.keys(FORMATS), 'vinyl').some((format) =>
        formatFilter(format, listing)
      )
    : FORMATS[filterValue].matchers.some((matcher) => isMatch(matcher, listing))

const moodFilter = (filterValue, listing) =>
  listing.moods?.includes(filterValue)

export default Filters
