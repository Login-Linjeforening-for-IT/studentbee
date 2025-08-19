'use client'

import { useEffect } from "react"
import CourseListClient from "./root/coursesClient"

const TAILWIND_LG_BREAKPOINT = 1024

export default function Menu() {
    useEffect(() => {
        function handleResize() {
            const menu = document.querySelector('.menu')
            if (menu) {
                if (window.innerWidth >= TAILWIND_LG_BREAKPOINT) {
                    menu.classList.add('hidden')
                }
            }
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="hidden menu absolute grid left-0 top-0 h-full w-full">
            <div className="mt-12">
                <CourseListClient />
            </div>
        </div>
    )
}

export function Burger() {
    function handleClick() {
        const menu = document.querySelector('.menu')

        if (menu) {
            menu.classList.toggle('hidden')
        }
    }

    return (
        <div className='lg:hidden grid place-self-center p-[0.2rem] w-[1.8rem] h-[1.8rem] relative' onClick={handleClick}>
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
        </div>
    )
}