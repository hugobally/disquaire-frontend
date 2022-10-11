import React, { useState } from 'react'
import Header from './Header'
import Bands from './Bands'
import { Link } from 'gatsby'

const Page = ({ children }) => {
  return (
    <div className="text-black sm:mx-auto sm:max-w-7xl sm:px-10">
      <Header />
      <main>
        <Bands />
        {children}
      </main>
      <footer>
        <div className="w-full flex justify-center opacity-50 py-8">
          <span>
            {'made by '}
            <Link className="underline" to="https://hugobally.me">
              {'Hugo Bally'}
            </Link>
            {' - source code available on '}
            <Link
              className="underline"
              to="https://github.com/hugobally/disquaire"
            >
              {'github'}
            </Link>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Page
