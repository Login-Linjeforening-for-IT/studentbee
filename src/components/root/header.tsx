'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const isStudy = path.includes('study')

    return (
        <div className="grid grid-cols-2 gap-4 pb-4">
            <Link href={`/course/${course}`} className={`text-lg text-bright ${isStudy ? "bg-normal" : "bg-light"} rounded-lg px-2`}>✓ Test</Link>
            <Link href={`/course/${course}/study`} className={`text-lg text-bright ${isStudy ? "bg-light" : "bg-normal"} rounded-lg px-2`}>✎ Study</Link>
        </div>
    )
}