import React from 'react'
import { getCourses } from '@/utils/fetch'
import Link from 'next/link'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Home() {
    const courses = await getCourses()

    if (typeof courses === 'string') {
        return (
            <div className="w-full h-full ">
                <h1 className="w-full grid place-items-center">No courses</h1>
                <Link href='/add/course' className="text-2xl bg-gray-500 rounded-md px-2 mr-2">Add course</Link>
            </div>
        )
    }

    return (
        <div className="w-full h-full rounded-xl overflow-auto grid noscroll place-items-center">
            <div className="w-[35vw] h-[45vh] bg-gray-800 rounded-xl p-8 overflow-auto">
                <h1 className="text-2xl text-center font-semibold mb-8">Select course</h1>
                <div className="w-full grid">
                    {courses.map((course) => <Link
                        href={`/course/${course.id}`}
                        key={course.id}
                        className="text-xl bg-gray-700 w-full mb-2 rounded-md p-2">
                        {course.id}
                    </Link>)}
                </div>
            </div>
        </div>
    )
}
