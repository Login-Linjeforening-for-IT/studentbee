'use client'

import { sendLogout } from "@utils/user"
import isLoggedIn from "@utils/user"
import Image from "next/image"
import Link from "next/link"

// Displays the login icon or the profile icon depending on the login status
export default function RightIcon() {
    const loggedIn = isLoggedIn()
    const href = loggedIn ? '/profile' : '/login'
    const size = loggedIn ? 45 : 50
    const icon = loggedIn ? "/images/profile.svg" : "/images/login.svg"

    return (
        <Link href={href} className='grid place-items-center'>
            <Image src={icon} alt="logo" height={size} width={size} />
        </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function LeftIcon() {
    const loggedIn = isLoggedIn()
    const href = loggedIn ? '/' : '/register'
    const icon = loggedIn ? "/images/logout.svg" : "/images/join.svg"
    const size = loggedIn ? 45 : 55

    function handleClick() {
        if (loggedIn) {
            sendLogout()
        }
    }

    return (
        <Link href={href} className='grid place-items-center' onClick={handleClick}>
            <Image src={icon} alt="logo" height={size} width={size} />
        </Link>
    )
}
