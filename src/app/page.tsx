import React from 'react'
import { getCourses } from '@/utils/fetch'
import Link from 'next/link'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Home() {
    const courses = await getCourses()

    if (typeof courses === 'string') {
        return (
            <div className="w-full h-full grid grid grid-rows-12">
                <h1 className="w-full grid place-items-center text-2xl">No courses</h1>
                <Link href={`/add/course`} className="text-2xl rounded-xl px-2 bg-gray-800 p-2 px-8 row-span-11 grid place-self-center">Add course</Link>
            </div>
        )
    }

    return (
        <div className="w-full h-full rounded-xl overflow-auto noscroll flex justify-center flex-col place-items-center">
            <div className="w-[35vw] h-[45vh] bg-gray-800 rounded-xl p-8 overflow-auto mb-8">
                <h1 className="text-2xl text-center font-semibold mb-4">Select course</h1>
                <div className="w-full h-[5vh] grid">
                    {courses.map((course) => <Link
                        href={`/course/${course.id}`}
                        key={course.id}
                        className="text-xl bg-gray-700 w-full mb-2 rounded-md p-2">
                        {course.id}
                    </Link>)}
                </div>
            </div>
            <Link href="/add/course" className='bg-gray-800 h-[5vh] w-[35vw] grid place-items-center rounded-xl px-8'>Add course</Link>
        </div>
    )
}
