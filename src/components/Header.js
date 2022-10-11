import * as React from 'react'
import { useMemo, useState } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import classNames from 'classnames'
import FacebookSVG from '../images/facebook-icon.svg'
import InstagramSVG from '../images/instagram-icon.svg'
import MastodonSVG from '../images/mastodon-icon.svg'
import BandcampSVG from '../images/bandcamp-icon.svg'
import EmailSVG from '../images/email-icon.svg'

const iconSVG = {
  instagram: InstagramSVG,
  facebook: FacebookSVG,
  mastodon: MastodonSVG,
  bandcamp: BandcampSVG,
  mail: EmailSVG,
}

const Header = (factory, deps) => {
  const data = useStaticQuery(graphql`
    {
      allIntroText {
        nodes {
          content
        }
      }
      allContactUrl {
        nodes {
          name
          url
        }
      }
    }
  `)

  const introTextHTML = useMemo(
    () => data.allIntroText.nodes[0].content,
    [data]
  )

  const links = useMemo(
    () => {
      const array = data.allContactUrl.nodes
      const mail = array.find(({ name, url }) => name === 'mail' && url)
      const rest = array.filter(({ name, url }) => name !== 'mail' && url)
      return mail ? [mail, ...rest] : rest
    },
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
      <header className="mt-5 mb-10 flex w-full flex-col items-center justify-center rounded-lg bg-opacity-0 p-10 shadow-none sm:bg-gray-50 sm:shadow-inner">
        <div
          className="prose text-center text-2xl"
          dangerouslySetInnerHTML={{
            __html: introTextHTML,
          }}
        />
        <address className={classNames('mt-10 flex gap-3')}>
          {links.map(({ name, url }) => (
            <Link
              to={
                name === 'mail'
                  ? `mailto:${url}`
                  : !url.includes('https')
                  ? `https://${url}`
                  : url
              }
            >
              <div className={classNames('transition hover:scale-110 p-2')}>
                <img
                  className={classNames('w-10 ')}
                  src={iconSVG[name]}
                  alt={name}
                />
              </div>
            </Link>
          ))}
        </address>
      </header>
    </>
  )
}

export default Header
