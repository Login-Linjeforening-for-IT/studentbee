'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Burger } from './sidebar'
import ThemeSwitch from './theme/themeSwitch'
import { LogOut, User } from 'lucide-react'
import { getCookie } from 'uibee/utils'

// Displays the login icon or the profile icon depending on the login status
export function RightIcon() {
    const [loggedIn, setLoggedIn] = useState<string | null>(null)

    useEffect(() => {
        setLoggedIn(getCookie('access_token'))
    }, [])

    function handleClick() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('redirect', window.location.href)
        }
    }

    return (
        loggedIn &&
            <Link
                href='/profile'
                className='grid place-self-center w-[1.8rem] h-[1.8rem] relative'
                onClick={handleClick}
            >
                <User className='h-full' />
            </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function MiddleIcon() {
    const [loggedIn, setLoggedIn] = useState<string | null>(null)

    useEffect(() => {
        setLoggedIn(getCookie('access_token'))
    }, [])

    function handleLogout(e: React.MouseEvent) {
        e.preventDefault()
        if (typeof window !== 'undefined') {
            window.location.href = '/api/logout'
        }
    }

    return (
        loggedIn &&
            <Link
                href={'/api/logout'}
                prefetch={false}
                onClick={handleLogout}
                className='grid place-self-center items-center w-[1.8rem] h-[1.8rem] relative'
            >
                <LogOut />
            </Link>
    )
}

export function RightSide() {

    return (
        <div className='flex justify-end rounded-xl gap-2 md:min-w-[10rem]'>
            {/* create account */}
            <MiddleIcon />
            {/* login */}
            <RightIcon />
            <ThemeSwitch />
            <Burger />
        </div>
    )
}
