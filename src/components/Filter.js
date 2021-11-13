import * as React from 'react'

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
            className={`${classes}`}
            id={value}
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
    <fieldset className="py-10 text-4xl">
      <div className="flex flex-row">
        <legend>{legend}</legend>
        <div className="flex flex-grow gap-10 justify-end">{items}</div>
      </div>
    </fieldset>
  )
}

export default Filter
