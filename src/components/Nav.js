import * as React from 'react'
import { useEffect, useState } from 'react'

const Nav = ({}) => {
  const [showBands, setShowBands] = useState(false)

  return (
    <div
      className="flex flex-col w-full py-2.5
        sm:justify-center sm:gap-10 sm:bg-gray-400"
    >
      {/*todo semantics*/}
      <div className="px-10 my-10">
        Ajna records is a record label based in Nantes, France. Here is more
        text about what we do, and you can read this text, or not. I'm not your
        primary caretaker, I can't tell you what to do. Anyway, scroll for more
        stuff !{' '}
      </div>

      <button className="py-2.5">ABOUT</button>
      <button className="py-2.5">FRIENDS</button>
      <button
        className="py-2.5"
        onClick={() => {
          setShowBands((showBands) => !showBands)
        }}
      >
        BANDS
      </button>
      {showBands && (
        <ul>
          <li>band 1</li>
          <li>band 2</li>
          <li>band 3</li>
          <li>band 4</li>
        </ul>
      )}
    </div>
  )
}

export default Nav
