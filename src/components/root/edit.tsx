'use client'

import { getCourses } from "@/utils/fetch"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Edit() {
    const [courses, setCourses] = useState<CourseAsList[]>([])
    const [error, setError] = useState('')
    const [displayCourseSelector, setDisplayCourseSelector] = useState(false)

    useEffect(() => {
        (async() => {
            const newCourses = await getCourses('client')

            if (typeof newCourses === 'string') {
                setError(newCourses)
            } else {   
                setCourses(newCourses)
            }
        })()
    }, [])

    function handleReview() {
        setDisplayCourseSelector(true)
    }

    function CourseSelector() {
        return (
            <div className="w-full h-full absolute left-0 top-0 grid place-items-center bg-black bg-opacity-90" onClick={() => setDisplayCourseSelector(false)}>
                <div className="w-[35vw] h-[45vh] bg-dark rounded-xl p-8 overflow-auto noscroll">
                    <h1 className="text-xl text-center font-semibold mb-4">Edit course</h1>
                    <div className="w-full grid space-y-2">
                        {courses.map((course) => (
                            <Link
                                href={`/edit/${course.id}`}
                                key={course.id}
                                className="text-lg bg-light w-full rounded-md p-2"
                            >
                                {course.id}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (typeof courses === 'string') {
        return <h1 className="hidden lg:grid w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div className="hidden lg:grid">
            {displayCourseSelector && <CourseSelector />}
            <div className="flex flex-rows">
                <button onClick={handleReview} className="text-md rounded-md pt-[3.5px]">♺</button>
            {   error && <h1 className="hidden 2xl:grid pl-2 pt-1 overflow-auto noscroll whitespace-nowrap text-red-500">{error}</h1>}
            </div>
            {error && <h1 className="2xl:hidden -ml-[85px] overflow-auto noscroll whitespace-nowrap text-red-500">{error}</h1>}
        </div>
    )
}