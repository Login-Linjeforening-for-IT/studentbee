'use client'

import GradeChart from '@parent/src/components/grades/gradeChart'
import Slider from '@parent/src/components/grades/slider'
import { useState } from 'react'

type ClientPageProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grades: any
    years: number[]
    defaultYear: number
}

export default function ClientPage({ grades, years, defaultYear }: ClientPageProps) {
    const [selectedYear, setSelectedYear] = useState(defaultYear)

    return (
        <div className='w-full h-full flex flex-col'>
            <div className='grow min-h-0 w-full'>
                <GradeChart grades={grades} years={years} selectedYear={selectedYear} />
            </div>
            <div className='shrink-0 w-full pb-1'>
                <Slider years={[...years].reverse()} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            </div>
        </div>
    )
}
