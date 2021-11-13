import * as React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

const Layout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-10">
      <header>
        <Link to="/" className="flex place-content-center">
          {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
          <StaticImage
            src="../images/ajna-records-logo-500x500.jpg"
            alt="Ajna Records"
            width={200}
            height={200}
          />
        </Link>
      </header>
      {children}
    </div>
  )
}

export default Layout
