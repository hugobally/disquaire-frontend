import * as React from 'react'
import { useMemo, useState } from 'react'
import { graphql, Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import Header from '../components/Header'
import Listings from '../components/Listings'
import Page from '../components/Page'

// Use gatsby prebuilt layout stuff to prevent unmounting/rerenders on page change TODO
const IndexPage = ({ data }) => {
  return (
    <Page>
      <Listings />
    </Page>
  )
}

export default IndexPage
