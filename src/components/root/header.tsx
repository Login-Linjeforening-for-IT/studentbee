'use client'

import getItem, { setItem } from "@/utils/localStorage"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const isStudy = path.includes('study') || path.includes('files') || getItem('leftnav') === 'study'

    return (
        <div className="grid grid-cols-2 gap-4 pb-4">
            <Link onClick={() => setItem('leftnav', 'test')} href={`/course/${course}`} className={`text-lg text-bright ${isStudy ? "bg-normal" : "bg-light"} rounded-lg px-2`}>◉ Browse</Link>
            <Link onClick={() => setItem('leftnav', 'study')} href={`/course/${course}/study`} className={`text-lg text-bright ${isStudy ? "bg-light" : "bg-normal"} rounded-lg px-2`}>✎ Study</Link>
        </div>
    )
}
