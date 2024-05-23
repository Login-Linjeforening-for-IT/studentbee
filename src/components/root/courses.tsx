import { getCourses } from "@utils/fetch"
import Link from "next/link"
import Edit from "./edit"

export default async function Courses() {
    const courses = await getCourses()

    if (typeof courses === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div className='w-full h-full rounded-xl col-span-2 overflow-auto pr-5'>
            <div className="flex flex-cols mb-2">
                <h1 className="text-2xl mr-2">Courses</h1>
                <Link href='/add/course' className="text-2xl bg-gray-500 rounded-md px-2 mr-2">+</Link>
                <Edit />
            </div>
            {courses.map((course, index) => 
                <Course key={index} course={course} margin={index != courses.length - 1} /> 
            )}
        </div>
    )
}

function Course({course, margin}: CourseProps) {
    return (
        <Link href={`/course/${course.id}`} className={`w-full h-[5vh] bg-gray-700 ${margin ? 'mb-2' : ''} rounded-xl  flex items-center pl-4`}>
            <h1>{course.id}</h1>
        </Link>
    )
}