'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Edit from './edit'
import { Menu, Pencil } from 'lucide-react'

export default function Header() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const [isStudy, setIsStudy] = useState(path.includes('study') || path.includes('files'))

    useEffect(() => {
        setIsStudy(path.includes('study') || path.includes('files'))
    }, [path])

    return (
        <div className='bg-login-900 md:p-2 rounded-xl'>
            <div className='grid grid-cols-2 gap-2 justify-items-center pb-2'>
                <Link
                    href={course && course != 'study' ? `/course/${course}` : '/'}
                    className={`${isStudy ? 'bg-login-800' : 'bg-login-700'} w-full rounded-lg px-2 content-center text-login-300 flex text-lg items-center`}
                >
                    <h1><Menu className='p-1'/></h1>
                    <h1 className='grid text-base place-self-center'>Browse</h1>
                </Link>
                <Link
                    href={`/course/${course}/study`}
                    className={`${isStudy ? 'bg-login-700' : 'bg-login-800'} w-full rounded-lg px-2 text-login-300 flex text-lg items-center`}
                >
                    <h1><Pencil className='p-1'/></h1>
                    <h1 className='grid text-base place-self-center'>Study</h1>
                </Link>
            </div>
            <CourseHeader />
        </div>
    )
}

function CourseHeader() {
    return (
        <div className='hidden lg:flex flex-cols gap-2'>
            <h1 className='text-lg'>Courses</h1>
            <Link
                href='/add/course'
                className='hidden rounded-md lg:grid text-base self-center bg-login-700 lg:px-2 2xl:px-4'
            >
                Add
            </Link>
            <Edit />
        </div>
    )
}
