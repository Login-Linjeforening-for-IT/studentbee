'use client'

import { getCourse } from "@/utils/fetch"
import getCookie from "@utils/cookies"
import { useEffect, useState } from "react"

export default function UserInfo() {
    const [user, setUser] = useState<LoggedInUser>({ id: 0, name: 'Loading...', username: "Loading...", time: 0 })
    const [edit, setEdit] = useState('')
    const timeAsHumanReadable = `${(user.time / 60).toFixed(0)}min ${user.time % 60}s`

    const [left, setLeft] = useState('')
    const [middle, setMiddle] = useState('')
    const [right, setRight] = useState('')

    useEffect(() => {
        const cookie = getCookie('user')
        const userFromCookie = cookie ? JSON.parse(cookie) : undefined
        const pathnames = window.location.pathname.split('/')
        let course = pathnames[1] === 'course' || 'edit' ? pathnames[2] : window.location.pathname.split('/')[-1]
        let length = 'Loading...';

        (async() => {
            const courseByID = await getCourse(course)
            if (typeof courseByID === 'object') {
                length = String(courseByID.cards.length)
            }
        })()
        
        if (userFromCookie) {
            setUser(userFromCookie)
            setLeft(userFromCookie.username)
        }

        if (window.location.pathname.includes('edit') && middle !== edit || !middle.length) {
            setEdit(`Editing ${window.location.pathname.split('/')[2]}`)
            setMiddle(`Editing ${window.location.pathname.split('/')[2]}`)
            setRight(length)
        } else if (!window.location.pathname.includes('edit') && (left != user.username || middle != course || right != timeAsHumanReadable)) {
            setLeft(user.username)
            
            if (course) {
                setMiddle(course)
            }
            
            setRight(timeAsHumanReadable)
        }
    }, [])

    return (
        <div className='grid grid-cols-3 w-full h-full bg-gray-800 col-span-8 rounded-xl'>
            <h1 className='grid place-items-center text-xl text-gray-400'>{left}</h1>
            <h1 className='grid place-items-center text-2xl'>{middle}</h1>
            <h1 className='grid place-items-center text-xl text-gray-400'>{right}</h1>
        </div>
    )
}
