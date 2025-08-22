'use client'

import { BROWSER_API } from '@parent/constants'
import { sendLogout } from '@utils/user'
import isLoggedIn from '@utils/user'
import Link from 'next/link'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Burger } from './sidebar'
import ThemeSwitch from './theme/themeSwitch'
import { LogOut, User, UserPlus } from 'lucide-react'

type MiddleIconProps = {
    setActive: Dispatch<SetStateAction<boolean>>
}

// Displays the login icon or the profile icon depending on the login status
export function RightIcon() {
    const [href, setHref] = useState('/login')
    const loggedIn = isLoggedIn()

    function handleClick() {
        localStorage.setItem('redirect', window.location.href)
    }

    useEffect(() => {
        if (loggedIn) {
            setHref(`/profile/${loggedIn}`)
        } else {
            setHref(`${BROWSER_API}/login`)
        }
    }, [loggedIn])

    return (
        <Link 
            href={href} 
            className='grid place-self-center w-[1.8rem] h-[1.8rem] relative'
            onClick={handleClick}
        >
            { loggedIn ? <User className='h-full' /> : <UserPlus className='h-full' /> }
        </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function MiddleIcon({ setActive }: MiddleIconProps) {
    const href = '/'
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
            <LogOut />
        </Link>
    )
}

export function RightSide() {
    const [active, setActive] = useState(true)

    return (
        <div className='flex justify-end rounded-xl gap-2 md:min-w-[10rem]'>
            {/* create account */}
            {active && <MiddleIcon setActive={setActive} />}
            {/* login */}
            <RightIcon />
            <ThemeSwitch />
            <Burger />
        </div>
    )
}
