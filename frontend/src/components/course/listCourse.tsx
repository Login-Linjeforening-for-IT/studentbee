import Link from 'next/link'

type CourseItemProps = {
    course: Courses
    currentPath: string
}

export default function ListCourse({ course, currentPath }: CourseItemProps) {
    const currentCourse = currentPath.includes('/course/') ? currentPath.split('/course/')[1].split('/')[0] : ''
    const current = currentCourse === course.courseCode
    const currentStyle = current ? '*:fill-login text-login pl-[0.8rem] border-0 border-l-[0.2rem] hover:pl-[1.5rem]' : 'hover:pl-4'

    return (
        <Link
            href={`/course/${course.courseCode}`}
            className={`
                lg:bg-transparent flex flex-row py-2 transition-[padding] gap-2 
                items-center duration-500 font-medium cursor-pointer
                hover:*:fill-login hover:text-login ${currentStyle}
            `}
        >
            <h1>{course.courseCode}</h1>
        </Link>
    )
}
