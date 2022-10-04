import * as React from 'react'
import {useState} from 'react'
import {Link} from 'gatsby'
import {StaticImage} from 'gatsby-plugin-image'

const ContentDrawer = ({title, children, style}) => {
    const [showContent, setShowContent] = useState(false)

    return (
        <li className={`${style || ''}`}>
            {/*TODO Semantics*/}
            <button onClick={() => setShowContent(!showContent)} className="w-full">
                <h1 className="block py-2.5 text-3xl pl-2 mt-6">{title}</h1>
            </button>
            {children}
        </li>
    )
}

const Header = ({}) => {
    return (
        <header>
            <nav>
                <div className="bg-white rounded-b-full">
                    <Link to="/" className="flex place-content-center ">
                        {/*Import image via a component so the build fails if not found / Or use URL ? TODO*/}
                        <StaticImage
                            src="../images/ajna-records-logo-500x500.svg"
                            alt="Ajna Records"
                            width={200}
                            height={200}
                            placeholder="tracedSVG"
                        />
                    </Link>
                </div>
            </nav>

            <ul
                className="flex w-full flex-col p-4 sm:justify-center sm:gap-10 sm:bg-gray-400"
            >
                <p className="bg-black p-6 text-white">
                    AJNA RECORDS is a record label and distro based in Nantes, France. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur.
                </p>
                <ContentDrawer title="ABOUT US" style="bg-black text-white">
                    <p className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur.
                    </p>
                </ContentDrawer>
                <ContentDrawer title="BANDS" style="bg-black text-white mb-6">
                    <p>
                        Meshuggah
                    </p>
                    <p>
                        Pomme
                    </p>
                    <p>
                        Djépludidée D'Nomdgroupe
                    </p>
                </ContentDrawer>
            </ul>
        </header>
    )
}

export default Header
