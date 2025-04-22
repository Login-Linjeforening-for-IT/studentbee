'use client'

import { BROWSER_API } from "@parent/constants"
import { sendLogout } from "@utils/user"
import isLoggedIn from "@utils/user"
import Image from "next/image"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Burger } from "./sidebar"
import ThemeSwitch from "./theme/themeSwitch"

type MiddleIconProps = {
    setActive: Dispatch<SetStateAction<boolean>>
}

// Displays the login icon or the profile icon depending on the login status
export function RightIcon() {
    const [href, setHref] = useState('/login')
    const [icon, setIcon] = useState("/images/join.svg")
    const loggedIn = isLoggedIn()

    function handleClick() {
        localStorage.setItem('redirect', window.location.href)
    }

    useEffect(() => {
        if (loggedIn) {
            setHref(`/profile/${loggedIn}`)
            setIcon("/images/profile.svg")
        } else {
            setHref(`${BROWSER_API}/login`)
            setIcon("/images/join.svg")
        }
    }, [loggedIn])

    return (
        <Link 
            href={href} 
            className='grid place-self-center w-[1.8rem] h-[1.8rem] relative'
            onClick={handleClick}
        >
            <Image src={icon} alt="logo" fill={true} />
        </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function MiddleIcon({ setActive }: MiddleIconProps) {
    const href = '/'
    const icon = "/images/logout.svg"
    const loggedIn = isLoggedIn()

    useEffect(() => {
        if (loggedIn) {
            setActive(true)
        } else {
            setActive(false)
        }
    }, [loggedIn])

    function handleClick() {
        if (loggedIn) {
            sendLogout()
        }
    }

    return (
        <Link 
            href={href} 
            className='grid place-self-center w-[1.8rem] h-[1.8rem] relative' 
            onClick={handleClick}
        >
            <Image src={icon} alt="logo" fill={true} />
        </Link>
    )
}

// Displays the scoreboard icon
export function LeftIcon() {
    const href = "/scoreboard"
    const icon = "/images/scoreboard.svg"

    return (
        <Link href={href} className='grid place-self-center w-[3.5vh] h-[3.5vh] relative'>
            <Image src={icon} alt="logo" fill={true} />
        </Link>
    )
}

export function RightSide() {
    const [active, setActive] = useState(true)

    return (
        <div className={`flex justify-end rounded-xl gap-2 md:min-w-[10rem]`}>
            {/* create account */}
            {active && <MiddleIcon setActive={setActive} />}
            {/* login */}
            <RightIcon />
            <ThemeSwitch />
            <Burger />
        </div>
    )
}
