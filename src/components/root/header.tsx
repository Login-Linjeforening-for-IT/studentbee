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
        <div className="grid grid-cols-2 gap-4 pb-4">
            <Link 
                onClick={() => setItem('leftnav', 'test')} 
                href={`/course/${course}`} 
                className={`${isStudy ? "bg-normal" : "bg-light"} rounded-lg px-2 content-center text-bright flex text-lg`}
            >
                <h1 className="mr-2">◉</h1>
                <h1 className="hidden xl:grid place-self-center">Browse</h1>
            </Link>
            <Link 
                onClick={() => setItem('leftnav', 'study')} 
                href={`/course/${course}/study`} 
                className={`${isStudy ? "bg-light" : "bg-normal"} rounded-lg px-2 text-bright flex text-lg`}
            >
                <h1 className="mr-2">✎</h1>
                <h1 className="hidden xl:grid place-self-center">Study</h1>
            </Link>
        </div>
    )
}
