import * as React from 'react'
import { useState } from 'react'
import classNames from 'classnames'

export const FORMATS = {
  vinyl: { title: 'Vinyl', match: ['LP', 'EP', '12"'] },
  cd: { title: 'CD', match: ['CD'] },
  cassette: { title: 'Cassette', match: ['Cass'] },
}

// Handle no or few results TODO
//
// Use a Regex to filter entries
// + exclude terms (CD, LP -> matches vinyl but shouldnt)
const Filters = ({ data, filters, setFilters }) => {
  const [mobileModal, setMobileModal] = useState()

  return (
    <div
      className={classNames('top-0 z-10 m-3 sm:w-auto sm:mx-10 sm:mt-24 sm:border-black sm:border-2', {
        sticky: !mobileModal,
        'fixed overflow-scroll overscroll-contain': mobileModal,
      })}
    >
      <div
        className={classNames('flex', {
          'flex-row items-center sm:flex-col sm:justify-between': !mobileModal,
          'align-start flex-col overflow-scroll overscroll-contain':
            mobileModal,
        })}
      >
        <Filter
          filterName="mood"
          legend="mood"
          values={data.allMood.nodes.map(({ value }) => ({
            title: value,
            value,
          }))}
          {...{
            filters,
            setFilters,
            mobileModal,
            setMobileModal,
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
          {...{
            filters,
            setFilters,
            mobileModal,
            setMobileModal,
          }}
        />
      </div>
    </div>
  )
}

const Filter = ({
  filters,
  setFilters,
  legend,
  filterName,
  values,
  mobileModal,
  setMobileModal,
}) => {
  const currentValue = filters?.[filterName]

  return (
    <div
      className={classNames(
        `flex-1 sm:w-full
              bg-black sm:bg-white
              text-3xl 
        `,
        {
          'sr-only': mobileModal && filterName !== mobileModal,
        }
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <legend
          className="relative p-2 uppercase text-white sm:text-black"
          style={{
            fontFamily: 'Oswald', // TODO clean this up
          }}
        >
          {legend}
          {/*{`➜${currentValue || 'all'}`}*/}
          <button
            onClick={() => {
              setMobileModal(
                mobileModal === filterName ? null : filterName
              )
            }}
            className="absolute top-0 left-0 h-full w-full sm:hidden"
          />
        </legend>
        <div
          className={classNames(
            'flex flex-col sm:flex-row sm:not-sr-only sm:flex-grow sm:justify-end sm:gap-1',
            {
              'h-screen': filterName === mobileModal,
              'sr-only': filterName !== mobileModal,
            }
          )}
        >
          {[{ title: 'all', value: 'all' }, ...values].map(
            ({ value, title }) => {
              const highlighted =
                currentValue === value || (value === 'all' && !currentValue)
              const classes = highlighted ? 'underline' : ''

              return (
                <div key={value} className="p-2 bg-black text-white sm:bg-white sm:text-black">
                  <button
                    className={`${classes} lowercase`}
                    id={value}
                    style={{ fontFamily: 'Oswald' }} // TODO clean this up
                    onClick={() => {
                      setFilters((filters) => ({
                        ...filters,
                        [filterName]: value !== 'all' ? value : null,
                      }))
                      setMobileModal(null)
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
