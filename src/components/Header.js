import * as React from 'react'
import { useMemo, useState } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import Bands from './Bands'
import classNames from 'classnames'

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
    <>
      <nav>
        <div
          className={classNames(
            'flex place-content-center rounded-b-full'
            // 'bg-white sm:mt-10 sm:bg-black'
          )}
        >
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
      <header className="w-full flex justify-center mt-5 mb-10 rounded-3xl bg-opacity-0 p-10 shadow-none sm:justify-center sm:bg-gray-50 sm:shadow-inner">
        <div
          className="prose text-2xl text-center"
          dangerouslySetInnerHTML={{
            __html: introTextHTML,
          }}
        />
      </header>
    </>
  )
}

export default Header
