import * as React from 'react'
import { useState } from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

const ContentDrawer = ({ title, children, style }) => {
  const [showContent, setShowContent] = useState(true)

  return (
    <li className={`${style || ''}`}>
      {/*<button onClick={() => setShowContent(!showContent)} className="w-full">*/}
      <h1 className="mt-6 block py-2.5 pl-2 text-3xl">{title}</h1>
      {/*</button>*/}
      {showContent && children}
    </li>
  )
}

const Header = ({}) => {
  return (
    <header>
      <nav>
        <div className="rounded-b-full bg-white sm:mt-10 sm:bg-black">
          <Link to="/" className="flex place-content-center">
            {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
            <StaticImage
              src="../images/ajna-records-logo-500x500.svg"
              alt="Ajna Records"
              width={200}
              height={200}
              placeholder="tracedSVG"
              className="sm:rounded-full sm:bg-white sm:border-white sm:border-8"
            />
          </Link>
        </div>
      </nav>

      <ul className="sm:bg-gray-400 flex w-full flex-col p-4 sm:justify-center sm:gap-10">
        <p className="bg-black p-6 text-white">
          AJNA RECORDS is a record label and distro based in Nantes, France.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>
        {/*<ContentDrawer title="CONTACT" style="bg-black text-white">*/}
        {/*  <p>*/}
        {/*    Duis aute irure dolor in reprehenderit in voluptate velit esse*/}
        {/*    cillum dolore eu fugiat nulla pariatur.*/}
        {/*  </p>*/}
        {/*</ContentDrawer>*/}
        {/*<ContentDrawer title="BANDS" style="bg-black text-white mb-6">*/}
        {/*  <p>Meshuggah</p>*/}
        {/*  <p>Pomme</p>*/}
        {/*  <p>Djépludidée D'Nomdgroupe</p>*/}
        {/*</ContentDrawer>*/}
      </ul>
    </header>
  )
}

export default Header
