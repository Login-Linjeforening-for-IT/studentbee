'use client'

import getCookie from "@/utils/cookies"
import { useEffect, useState } from "react"

export default function UserInfo() {
    const [user, setUser] = useState({ name: 'User', time: 2000 })
    const [course, setCourse] = useState('PROG1001')
    const timeAsHumanReadable = `${(user.time / 60).toFixed(0)}min ${user.time % 60}s`

    useEffect(() => {
        const cookie = getCookie('user')
        const userFromCookie = cookie ? JSON.parse(cookie) : undefined
        // const course = getcours

        if (userFromCookie) {
            setUser(userFromCookie)
        }
    }, [])

    return (
        <div className='grid grid-cols-3 w-full h-full bg-gray-800 col-span-8 rounded-xl'>
            <h1 className='grid place-items-center text-xl text-gray-400'>{user.name}</h1>
            <h1 className='grid place-items-center text-2xl'>{course}</h1>
            <h1 className='grid place-items-center text-xl text-gray-400'>{timeAsHumanReadable}</h1>
        </div>
    )
}
