'use client'

import { sendLogout } from "@utils/user"
import isLoggedIn from "@/utils/user"
import Image from "next/image"
import Link from "next/link"

// Displays the login icon or the profile icon depending on the login status
export default function ProfileIcon() {
    const loggedIn = isLoggedIn()

    if (loggedIn) {
        return (
            <Link href='/profile' className='grid place-items-center'>
                <Image src="/images/profile.svg" alt="logo" height={45} width={45} />
            </Link>
        )
    }
    
    return (
        <Link href='/login' className='grid place-items-center'>
            <Image src="/images/login.svg" alt="logo" height={50} width={50} />
        </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function RegisterIcon() {
    const loggedIn = isLoggedIn()

    if (loggedIn) {
        return (
            <Link href='/' className='grid place-items-center' onClick={sendLogout}>
                <Image src="/images/logout.svg" alt="logo" height={45} width={45} />
            </Link>
        )
    }
    
    return (
        <Link href='/signup' className='grid place-items-center'>
            <Image src="/images/join.svg" alt="logo" height={55} width={55} />
        </Link>
    )
}
