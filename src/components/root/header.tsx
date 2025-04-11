'use client'

import getItem, { setItem } from "@/utils/localStorage"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const [isStudy, setIsStudy] = useState(false)

    useEffect(() => {
        setIsStudy(path.includes('study') || path.includes('files') || getItem('leftnav') === 'study')
    }, [path])

    return (
        <div className="grid grid-cols-2 gap-2 justify-items-center pb-4">
            <Link 
                onClick={() => setItem('leftnav', 'test')} 
                href={course ? `/course/${course}` : '/'} 
                className={`${isStudy ? "bg-normal" : "bg-light"} w-fit rounded-lg px-4 content-center text-bright flex text-lg`}
            >
                <h1 className="xl:mr-1">≡</h1>
                <h1 className="hidden xl:grid text-base place-self-center">Browse</h1>
            </Link>
            <Link 
                onClick={() => setItem('leftnav', 'study')} 
                href={`/course/${course}/study`} 
                className={`${isStudy ? "bg-light" : "bg-normal"} w-fit rounded-lg px-4 text-bright flex text-lg`}
            >
                <h1 className="xl:mr-1">✎</h1>
                <h1 className="hidden xl:grid text-base place-self-center">Study</h1>
            </Link>
        </div>
    )
}
