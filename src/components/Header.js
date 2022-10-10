import * as React from 'react'
import { useMemo, useState } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

const ContentDrawer = ({ title, children, className }) => {
  const [showContent, setShowContent] = useState(true)

  return (
    <li className={`${className || ''}`}>
      {/*<button onClick={() => setShowContent(!showContent)} className="w-full">*/}
      <h1 className="mt-6 block py-2.5 pl-2 text-center text-3xl text-white sm:mt-0">
        {title}
      </h1>
      {/*</button>*/}
      {showContent && children}
    </li>
  )
}

const Header = () => {
  const data = useStaticQuery(graphql`
    {
      allIntroText {
        nodes {
          content
        }
      }
    }
  `)

  const introTextHTML = useMemo(
    () => data.allIntroText.nodes[0].content,
    [data]
  )

  return (
    <header>
      <nav>
        <div className="flex place-content-center rounded-b-full bg-white sm:mt-10 sm:bg-black">
          <Link to="/">
            {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
            <StaticImage
              src="../images/ajna-records-logo-500x500.svg"
              alt="Ajna Records"
              width={200}
              height={200}
              placeholder="tracedSVG"
              className="sm:rounded-full sm:border-8 sm:border-white sm:bg-white"
            />
          </Link>
        </div>
      </nav>

      <ul className="flex w-full flex-col p-4 sm:justify-center">
        <p
          className="bg-black p-6 text-center text-white"
          dangerouslySetInnerHTML={{
            __html: introTextHTML,
          }}
        ></p>
        {/*<ContentDrawer title="Contact">*/}
        {/*  <p>*/}
        {/*    Duis aute irure dolor in reprehenderit in voluptate velit esse*/}
        {/*    cillum dolore eu fugiat nulla pariatur.*/}
        {/*  </p>*/}
        {/*</ContentDrawer>*/}
      </ul>
    </header>
  )
}

export default Header
