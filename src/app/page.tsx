import React from 'react'
import { getCourses } from '@/utils/fetch'
import Link from 'next/link'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Home() {
    const courses = await getCourses('server')

    if (typeof courses === 'string') {
        return (
            <div className="w-full h-full grid grid grid-rows-12">
                <h1 className="w-full grid place-items-center">No courses</h1>
                <Link href={`/add/course`} className="rounded-xl px-2 bg-darker p-2 px-8 row-span-11 grid place-self-center">Add course</Link>
            </div>
        )
    }

    return (
        <div className="w-full h-full rounded-xl overflow-auto noscroll flex md:justify-center flex-col place-items-center">
            <div className="flex flex-col 2xs:w-[80vw] xs:w-[50vw] sm:w-[30vw] max-h-[60vh] md:h-[45vh] bg-darker rounded-xl p-2 overflow-auto mb-8 noscroll gap-2">
                <h1 className="text-center font-semibold">Select course</h1>
                <div className='grid gap-2'>
                    {courses.map((course) => <Link
                        href={`/course/${course.id}`}
                        key={course.id}
                        className="text-2xs md:text-base bg-light w-full rounded-md p-1 pl-2 md:p-2 h-[28px] md:h-auto"
                    >
                        {course.id}
                    </Link>)}
                </div>
            </div>
            <Link href="/add/course" className='bg-darker h-[5vh] 2xs:w-[80vw] xs:w-[50vw] sm:w-[30vw] grid place-items-center rounded-xl px-8 text-2xs md:text-lg'>Add course</Link>
        </div>
    )
}
