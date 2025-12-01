'use client'

import { addCourse } from '@parent/src/utils/fetchClient'
import Link from 'next/link'
import { useState, use } from 'react'

export default function Add(props: { params: Promise<{ item: string[] }> }) {
    const params = use(props.params)
    const item = params.item[0].toUpperCase()

    if (!item) {
        return (
            <Link href='/add/course'>Add course</Link>
        )
    }

    return <AddCourse />
}

function AddCourse() {
    const [error, setError] = useState('')
    const emptyCourse = {
        id: '',
        name: '',
        cards: [],
        notes: '',
        learningBased: false
    }
    const [course, setCourse] = useState<Course>(emptyCourse)
    const [selected, setSelected] = useState(0)
    const courseIDspan = selected === 0 ? 'col-span-12' : 'col-span-10'
    const navigate = error.length
        ? '/add/course/'
        : course.id.length
            ? `/course/${course.id}`
            : '/add/course/'

    function handleCourseIdChange(id: string) {
        setCourse({ ...course, id })
    }

    function handleCourseNameChange(name: string) {
        setCourse({ ...course, name })
    }

    async function handleAddCourse() {
        const err = await addCourse(course)

        if (typeof err === 'string') {
            setError(err)
        }
    }

    function handleBack() {
        setSelected(0)
    }

    return (
        <div className='w-full h-full grid place-items-center'>
            <div className='bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center flex flex-col items-center gap-6'>
                <div className='grid grid-cols-12 w-4/5'>
                    {selected != 0 ? <button
                        className='bg-login-900 rounded-md px-2'
                        onClick={handleBack}
                    >
                        ⬅️
                    </button> : null}
                    <h1 className={`text-lg font-semibold ${courseIDspan} text-center`}>Add course</h1>
                    <h1 className={`text-md text-red-500 ${courseIDspan} text-center`}>{error}</h1>
                    {selected != 0 ? <div/> : null}
                </div>
                <input
                    value={course.id}
                    onChange={(event) => handleCourseIdChange(event.target.value.toUpperCase())}
                    type='text'
                    placeholder='Course ID (PROG1001)'
                    className='bg-login-700 rounded-lg overflow-hidden px-2 h-10 w-4/5 outline-hidden caret-login'
                    maxLength={10}
                />
                <input
                    value={course.name}
                    onChange={(event) => handleCourseNameChange(event.target.value.toUpperCase())}
                    type='text'
                    placeholder='Name (Grunnleggende programmering)'
                    className='bg-login-700 rounded-lg overflow-hidden px-2 h-10 w-4/5 outline-hidden caret-login'
                    maxLength={100}
                />
                <Link
                    href={navigate}
                    className='grid w-4/5 bg-login/70 outline outline-login/90 rounded-lg font-semibold h-10 place-items-center'
                    onClick={handleAddCourse}
                >
                    Add course
                </Link>
            </div>
        </div>
    )
}
