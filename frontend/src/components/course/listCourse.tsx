import Link from 'next/link'

type CourseItemProps = {
    course: Courses
    currentPath: string
}

export default function ListCourse({ course, currentPath }: CourseItemProps) {
    const currentCourse = currentPath.includes('/course/') ? currentPath.split('/course/')[1].split('/')[0] : ''
    const current = currentCourse === course.code

    return (
        <Link
            href={`/course/${course.code}`}
            className={`
                flex flex-row px-4 py-3 rounded-xl transition-all duration-200 gap-3 items-center group
                ${current ? 'bg-login-800 text-login-50 border-l-4 border-l-login shadow-md' : 'text-login-300 hover:bg-login-800/50 hover:text-login-100'}
            `}
        >
            <span className='font-medium text-sm flex-1 truncate'>{course.code}</span>
        </Link>
    )
}
