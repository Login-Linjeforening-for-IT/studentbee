'use client'

import React from 'react'
import Cards from '@parent/src/components/root/cards'
import Elements from '@parent/src/components/root/elements'
import Study from '@parent/src/components/root/study'
import { usePathname } from 'next/navigation'

type CourseClientProps = {
    course: CourseProps | null
    id: string
    current: number
    fileContent: string[]
}

export default function CourseClient({
    course,
    id,
    current,
    fileContent
}: CourseClientProps) {
    const path = usePathname()
    const isStudy = path.includes('study') || path.includes('files')
    const study = course?.learningBased || isStudy

    return (
        <div className='w-full grid grid-cols-6 xl:grid-cols-8 gap-2 h-full max-h-full rounded-lg overflow-auto'>
            {study && <Study courseId={id} value={fileContent} />}
            {!study && <div className={'w-full col-span-6 max-h-full overflow-auto noscroll'}>
                <Cards course={course} id={id} current={current} />
            </div>}
            {!study && <Elements id={id} current={current} course={course} />}
        </div>
    )
}
