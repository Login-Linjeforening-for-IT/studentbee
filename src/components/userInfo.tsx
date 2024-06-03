'use client'

import { getCourse } from "@/utils/fetch"
import getItem from "@utils/localStorage"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserInfo() {
    const [user, setUser] = useState<LoggedInUser>({ name: 'Loading...', username: "Loading...", time: 0 })
    const [edit, setEdit] = useState('')
    const path = usePathname()
    const timeAsHumanReadable = user.time !== 0 ? `${(user.time / 60).toFixed(0)}min ${user.time % 60}s` : ''

    const [left, setLeft] = useState('')
    const [middle, setMiddle] = useState('')
    const [right, setRight] = useState('')

    useEffect(() => {
        const newUser: User | undefined = getItem('user') as User | undefined
        const pathnames = path.split('/')
        let course = pathnames[1] === 'course' || 'edit' ? pathnames[2] : path.split('/')[-1]
        
        if (newUser && newUser != user) {
            setUser(newUser)
            setLeft(newUser.username)
        }

        if (path.includes('edit') && (middle !== edit || !middle.length)) {
            setEdit(`Editing ${path.split('/')[2]}`)
            setMiddle(`Editing ${path.split('/')[2]}`);

            (async() => {
                const courseByID = await getCourse(course, 'client')
                if (typeof courseByID === 'object') {
                    setRight(`${courseByID.cards.length} cards`)
                }
            })()
        } else if (!path.includes('edit') && ((left != user.username || user.username === 'Loading...') || middle != course || right != timeAsHumanReadable)) {            
            if (course) {
                setMiddle(course.toUpperCase())
            } else {
                setMiddle('exam.login.no')
            }
            
            setRight(timeAsHumanReadable)
        }
    }, [edit, left, middle, right, timeAsHumanReadable])

    return (
        <div className='grid grid-cols-3 w-full h-full bg-dark col-span-6 rounded-xl'>
            <h1 className='grid place-items-center text-xl text-bright'>{left}</h1>
            <h1 className='grid place-items-center text-xl'>{middle}</h1>
            <h1 className='grid place-items-center text-xl text-bright'>{right}</h1>
        </div>
    )
}
