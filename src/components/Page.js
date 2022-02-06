import React, { useState } from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import Nav from './Nav'

const Page = ({ children }) => {
  return (
    <div className="sm:max-w-7xl sm:mx-auto sm:px-10">
      <header className="relative">
        <Link to="/" className="flex place-content-center">
          {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
          <StaticImage
            src="../images/ajna-records-logo-500x500.jpg"
            alt="Ajna Records"
            width={200}
            height={200}
          />
        </Link>
        <Nav />
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Page
