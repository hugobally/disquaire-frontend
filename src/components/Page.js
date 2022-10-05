import React, { useState } from 'react'
import Header from './Header'

const Page = ({ children }) => {
  return (
    <div className="sm:max-w-7xl sm:mx-auto sm:px-10">
      <Header/>
      <main>{children}</main>
    </div>
  )
}

export default Page
