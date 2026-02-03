'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Pencil } from 'lucide-react'

export default function Header() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const [isStudy, setIsStudy] = useState(path.includes('study') || path.includes('files'))

    useEffect(() => {
        setIsStudy(path.includes('study') || path.includes('files'))
    }, [path])

    return (
        <div className='bg-login-900 md:p-2 rounded-2xl border border-login-800/50 shadow-sm'>
            <div className='grid grid-cols-2 gap-2 justify-items-center mb-2'>
                <Link
                    href={course && course != 'study' ? `/course/${course}` : '/'}
                    className={`
                        w-full rounded-xl px-4 py-2 content-center flex text-lg items-center gap-2 justify-center transition-all duration-200
                        ${isStudy ? 'bg-transparent text-login-400 hover:text-login-200 hover:bg-login-800/50' : 'bg-login-800 text-login-50 shadow-sm border border-login-700/50 cursor-default'}
                    `}
                >
                    <Menu className='w-5 h-5'/>
                    <span className='text-sm font-medium'>Browse</span>
                </Link>
                <Link
                    href={`/course/${course}/study`}
                    className={`
                        w-full rounded-xl px-4 py-2 flex text-lg items-center gap-2 justify-center transition-all duration-200
                        ${!isStudy ? 'bg-transparent text-login-400 hover:text-login-200 hover:bg-login-800/50' : 'bg-login-800 text-login-50 shadow-sm border border-login-700/50 cursor-default'}
                    `}
                >
                    <Pencil className='w-5 h-5'/>
                    <span className='text-sm font-medium'>Study</span>
                </Link>
            </div>
            <CourseHeader />
        </div>
    )
}

function CourseHeader() {
    return (
        <div className='hidden lg:flex! flex-col gap-2 p-1'>
            <div className='flex justify-between items-center px-1'>
                <h1 className='text-xs font-bold text-login-400 uppercase tracking-wider'>Courses</h1>
                <Link
                    href='/add/course'
                    className='text-xs text-login-300 hover:text-login-100 transition-colors'
                >
                    + Add
                </Link>
            </div>
            <Link
                href='/edit'
                className='hidden rounded-md lg:grid! text-base self-center bg-login-300/10 lg:px-2 2xl:px-4'
            >
                Edit
            </Link>
        </div>
    )
}
