'use client'

import { getCourses } from '@parent/src/utils/fetch'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
            <div className='w-full h-full absolute left-0 top-0 grid place-items-center bg-black bg-opacity-90 z-100' onClick={() => setDisplayCourseSelector(false)}>
                <div className='w-[35vw] h-[45vh] bg-login-900 rounded-xl p-8 overflow-auto noscroll'>
                    <h1 className='text-xl text-center font-semibold mb-2'>Edit course</h1>
                    <div className='w-full grid space-y-2'>
                        {courses.map((course) => (
                            <Link
                                href={`/edit/${course.id}`}
                                key={course.id}
                                className='text-lg bg-login-700 w-full rounded-md p-2'
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
        return <h1 className='hidden lg:grid w-full h-full grid place-items-center'>{courses}</h1>
    }

    return (
        <div className='hidden lg:grid'>
            {displayCourseSelector && <CourseSelector />}
            <div className='flex flex-rows'>
                <Link
                    onClick={handleReview}
                    className='text-base rounded-md self-center bg-login-700 lg:px-2 2xl:px-4'
                    href={''}>
                    Edit
                </Link>
            </div>
            {error && <Error text={error} />}
        </div>
    )
}

function Error({text}: { text: string }) {
    const path = location.href

    if (!path.includes('course')) {
        return null
    }

    return (
        <div className='absolute bg-login-900 bottom-8 right-8 min-h-50 p-2 max-w-[17.6vw] rounded-xl max-h-[19.5vh] overflow-auto'>
            <h1 className='text-red-500'>{text}</h1>
        </div>
    )
}