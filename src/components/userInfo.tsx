'use client'

import { getCourse } from "@/utils/fetch"
import getCookie from "@utils/cookies"
import { useEffect, useState } from "react"

export default function UserInfo() {
    const [user, setUser] = useState<LoggedInUser>({ id: 0, name: 'Loading...', username: "Loading...", time: 0 })
    const [edit, setEdit] = useState('')
    const timeAsHumanReadable = user.time !== 0 ? `${(user.time / 60).toFixed(0)}min ${user.time % 60}s` : ''

    const [left, setLeft] = useState('')
    const [middle, setMiddle] = useState('')
    const [right, setRight] = useState('')

    useEffect(() => {
        const newUser: User | undefined = getCookie('user') as User | undefined
        const pathnames = window.location.pathname.split('/')
        let course = pathnames[1] === 'course' || 'edit' ? pathnames[2] : window.location.pathname.split('/')[-1]
        
        if (newUser && newUser != user) {
            setUser(newUser)
            setLeft(newUser.username)
        }

        if (window.location.pathname.includes('edit') && (middle !== edit || !middle.length)) {
            setEdit(`Editing ${window.location.pathname.split('/')[2]}`)
            setMiddle(`Editing ${window.location.pathname.split('/')[2]}`);

            (async() => {
                const courseByID = await getCourse(course, 'client')
                if (typeof courseByID === 'object') {
                    setRight(`${courseByID.cards.length} cards`)
                }
            })()
        } else if (!window.location.pathname.includes('edit') && ((left != user.username || user.username === 'Loading...') || middle != course || right != timeAsHumanReadable)) {            
            if (course) {
                setMiddle(course.toUpperCase())
            } else {
                setMiddle('exam.login.no')
            }
            
            setRight(timeAsHumanReadable)
        }
    }, [edit, left, middle, right, timeAsHumanReadable])

    return (
        <div className='grid grid-cols-3 w-full h-full bg-dark col-span-8 rounded-xl'>
            <h1 className='grid place-items-center text-xl text-gray-400'>{left}</h1>
            <h1 className='grid place-items-center text-2xl'>{middle}</h1>
            <h1 className='grid place-items-center text-xl text-gray-400'>{right}</h1>
        </div>
    )
}
