'use client'

import Link from "next/link"
import Edit from "./edit"
import { usePathname } from "next/navigation"
import { useState } from "react"

type CoursesProps = {
    courses: CourseAsList[]
}

export default function StudyOrTest({courses}: CoursesProps) {
    const path = usePathname()
    const isStudy = path.includes('study')

    return (
        <div className="w-full">
            {isStudy && <FileTree/>}
            {!isStudy && <InnerCourses courses={courses} />}
        </div>
    )
}

function FileTree() {
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const isStudy = path.includes('study')
    const [displayInputField, setDisplayInputField] = useState(false)
    const [input, setInput] = useState('')

    return (
        <div className="w-full grid grid-rows-auto">
            <Link href={`/course/${course}`} className="text-lg rounded-md mr-2 text-bright w-full">/ test</Link>
            <div className="grid grid-cols-4">
                <Link href={`/course/${course}/study`} className="text-lg rounded-md mr-2 text-bright w-full col-span-3">/ study</Link>
                <button className="text-xl text-end text-bright" onClick={() => setDisplayInputField(!displayInputField)}>+</button>
            </div>
            {displayInputField && <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />}
        </div>
    )
}

function InnerCourses({courses}: CoursesProps) {
    return (
        <>
            <div className="flex flex-cols mb-2">
                <h1 className="text-xl mr-2">Courses</h1>
                <Link href='/add/course' className="text-xl rounded-md mr-2">+</Link>
                <Edit />
            </div>
            {courses.map((course, index) => 
                <Course key={index} course={course} margin={index != courses.length - 1} /> 
            )}
        </>
    )
}

function Course({course, margin}: CourseProps) {
    return (
        <Link href={`/course/${course.id}`} className={`w-full h-[5vh] bg-light ${margin ? 'mb-2' : ''} rounded-xl  flex items-center pl-4`}>
            <h1>{course.id}</h1>
        </Link>
    )
}