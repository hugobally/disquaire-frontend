import * as React from 'react'

const Nav = ({ showBand, setShowBand, showAbout, setShowAbout }) => {
  return (
    <nav
      className="flex flex-col w-full py-2.5
        sm:justify-center sm:gap-10 sm:bg-gray-400"
    >
      <button className="py-2.5">about</button>
      <button className="py-2.5">friends</button>
      <button className="py-2.5">bands</button>
    </nav>
  )
}

export default Nav
