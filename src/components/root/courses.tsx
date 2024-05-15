import { courses } from "@/app/data"
import Link from "next/link"

export default function Courses(): JSX.Element {
    return (
        <div className='w-full h-full rounded-xl col-span-2 overflow-auto pr-5'>
            <h1 className="text-2xl mb-2">Courses</h1>
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