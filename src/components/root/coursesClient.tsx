'use client'

import { getCourses } from "@utils/fetch"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import StudyOrTest from "./studyOrTest"
import { useEffect, useState } from "react"

export default function CourseListClient() {
    const [courses, setCourses] = useState<CourseAsList[] | string>("Loading...")

    useEffect(() => {
        (async() => {
            const response = await getCourses('server')

            if (response) {
                setCourses(response)
            }
        })()
    }, [])

    if (typeof courses === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div className='w-full h-full rounded-xl overflow-auto grid grid-rows-12 noscroll'>
            <div className="row-span-11 bg-dark rounded-xl mb-4 pt-4 pb-4">
                <div className="h-full px-4 overflow-auto noscroll">
                    <Header />
                    <StudyOrTest courses={courses} />
                </div>
            </div>
            <ToolTipsButton />
        </div>
    )
}