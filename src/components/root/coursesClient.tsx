'use client'

import { getCourses } from "@utils/fetch"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import StudyOrTest from "./studyOrTest"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function CourseListClient() {
    const [courses, setCourses] = useState<CourseAsList[] | string>("Loading...")
    const path = usePathname()

    useEffect(() => {
        (async() => {
            const response = await getCourses('client')

            if (response) {
                setCourses(response)
            }
        })()
    }, [])

    if (typeof courses === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div className='w-full h-full grid grid-rows-12 noscroll'>
            <div className="row-span-11 bg-darker mb-2 py-2">
                <div className="h-full px-2 noscroll">
                    <Header />
                    <StudyOrTest courses={courses} currentPath={path} />
                </div>
            </div>
            <ToolTipsButton />
        </div>
    )
}