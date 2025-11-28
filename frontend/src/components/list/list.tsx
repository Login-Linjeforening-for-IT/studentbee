import React from 'react'
import { getCourses } from '@parent/src/utils/fetch'
import Link from 'next/link'
import config from '@config'

export default async function SelectCourseList() {
    const courses = await getCourses('server')

    if (typeof courses === 'string') {
        return (
            <div className='w-full h-full grid grid-rows-12'>
                <h1 className='w-full grid place-items-center'>No courses</h1>
                <Link href={'/add/course'} className='rounded-xl px-2 bg-login-900 p-2 row-span-11 grid place-self-center'>Add course</Link>
            </div>
        )
    }

    return (
        <div className='relative h-full rounded-xl overflow-auto noscroll flex justify-center items-center'>
            <div className='flex flex-col items-center gap-2 py-3 px-4 bg-login-900 rounded-xl h-[calc(100vh-12rem)] xs:h-120 w-[calc(100vw-1rem)] xs:w-96'>
                <h1 className='text-center font-semibold py-2'>Select course</h1>
                <div className='flex flex-col w-full h-full rounded-xl p-2 overflow-auto noscroll gap-2'>
                    <div className='grid gap-2'>
                        {courses.map((course) => <Link
                            href={`/course/${course.id}`}
                            key={course.id}
                            className='text-2xs md:text-base bg-login-700 w-full rounded-md p-1 pl-2 md:p-2 h-7 md:h-auto'
                        >
                            {course.id}
                        </Link>)}
                    </div>
                </div>
                <Link href='/add/course' className='bg-login-900 hover:bg-login-800 w-fit px-4 py-2 grid place-items-center rounded-xl text-2xs md:text-lg'>Add course</Link>
            </div>
            {typeof config.version !== 'undefined' ? (
                <Link
                    className='absolute right-2 bottom-2 bg-[rgba(200,200,200,0.1)] px-[0.6rem] py-[0.4rem] rounded-md text-white tracking-[0.05em] font-semibold'
                    target='_blank'
                    href={`${config.url.GITLAB_URL}/tekkom/web/beehive/exam.login.no/-/tags/${config.version}`}
                >
                    v{config.version}
                </Link>
            ) : null}
        </div>
    )
}
