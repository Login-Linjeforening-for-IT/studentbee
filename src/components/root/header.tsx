'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Edit from "./edit"

export default function Header() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const [isStudy, setIsStudy] = useState(path.includes('study') || path.includes('files'))

    useEffect(() => {
        setIsStudy(path.includes('study') || path.includes('files'))
    }, [path])

    return (
        <div className="bg-darker p-2 rounded-xl">
            <div className="grid grid-cols-2 gap-2 justify-items-center pb-2">
                <Link 
                    href={course ? `/course/${course}` : '/'} 
                    className={`${isStudy ? "bg-normal" : "bg-light"} w-full rounded-lg px-2 content-center text-almostbright flex text-lg`}
                >
                    <h1 className="xl:mr-1">≡</h1>
                    <h1 className="grid text-base place-self-center">Browse</h1>
                </Link>
                <Link 
                    href={`/course/${course}/study`} 
                    className={`${isStudy ? "bg-light" : "bg-normal"} w-full rounded-lg px-2 text-almostbright flex text-lg`}
                >
                    <h1 className="xl:mr-1">✎</h1>
                    <h1 className="grid text-base place-self-center">Study</h1>
                </Link>
            </div>
            <CourseHeader />
        </div>
    )
}

function CourseHeader() {
    return (
        <div className="flex flex-cols gap-2">
            <h1 className="text-lg">Courses</h1>
            <Link 
                href='/add/course' 
                className="hidden rounded-md lg:grid text-base self-center bg-light lg:px-2 2xl:px-4"
            >
                Add
            </Link>
            <Edit />
        </div>
    )
}
