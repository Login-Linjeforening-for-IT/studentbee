'use client'

import React from 'react'
import Cards from '@/components/root/cards'
import Elements from '@/components/root/elements'
import Study from '@/components/root/study'
import { usePathname } from 'next/navigation'

type CourseClientProps = {
    course: Course | string
    learningBased: boolean | undefined
    id: string
    current: number
    comments: CardComment[][]
    fileContent: string[]
}

// Client main page for extra functionality
export default function CourseClient({ course, learningBased, id, current, comments, fileContent }: CourseClientProps) {
    const path = usePathname()
    const isStudy = path.includes('study') || path.includes('files')
    const study = learningBased || isStudy
    
    return (
        <div className="w-full h-full rounded-xl overflow-auto grid grid-cols-8 gap-8 noscroll">
            {study && <Study courseID={id} value={fileContent} />}
            {!study && <div className={`w-full h-full col-span-6`}>
                <Cards course={course} id={id} current={current} comments={comments} />
            </div>}
            {!study && <Elements id={id} current={current} course={course} />}
        </div>
    )
}
