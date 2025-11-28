'use client'

import Graphs from '@parent/src/components/grades/grahp'
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
        <div className='w-full max-w-[18rem] xs:max-w-[20rem]'>
            <Graphs grades={grades} years={years} selectedYear={selectedYear} />
            <Slider years={[...years].reverse()} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
        </div>
    )
}
