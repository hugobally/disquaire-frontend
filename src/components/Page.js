import React, { useState } from 'react'
import Header from './Header'

const Page = ({ children }) => {
  return (
    <div className="sm:mx-auto sm:max-w-7xl sm:px-10 text-black">
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default Page
