import * as React from 'react'
import { useState } from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

const ContentDrawer = ({ title, children, style }) => {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className={`${style || ''}`}>
      {/*TODO Semantics*/}
      <button onClick={() => setShowContent(!showContent)} className="w-full">
        <h1 className="block py-2.5 text-5xl">{title}</h1>
      </button>
      {showContent && children}
    </div>
  )
}

const Header = ({}) => {
  return (
    <header>
      <nav>
        <Link to="/" className="flex place-content-center">
          {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
          <StaticImage
            src="../images/ajna-records-logo-500x500.jpg"
            alt="Ajna Records"
            width={200}
            height={200}
          />
        </Link>
      </nav>

      <div
        className="flex w-full flex-col
        sm:justify-center sm:gap-10 sm:bg-gray-400"
      >
        <p className="bg-black p-10 text-white">
          Ajna records is a record label based in Nantes, France. Here is more
          text about what we do, and you can read this text, or not.
        </p>

        <ContentDrawer title="ABOUT">
          <p>
            Ajna records is a record label based in Nantes, France. Here is more
            text about what we do, and you can read this text, or not.
          </p>
        </ContentDrawer>
        <ContentDrawer title="BANDS" style="bg-black text-white">
          <p>
            Ajna records is a record label based in Nantes, France. Here is more
            text about what we do, and you can read this text, or not.
          </p>
        </ContentDrawer>
        <ContentDrawer title="FRIENDS">
          <p>
            Ajna records is a record label based in Nantes, France. Here is more
            text about what we do, and you can read this text, or not.
          </p>
        </ContentDrawer>
      </div>
    </header>
  )
}

export default Header
