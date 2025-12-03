import Link from 'next/link'
import config from '@config'
import { getCourses } from '@utils/api'

export default async function SelectCourseList({ isEdit }: { isEdit?: boolean }) {
    const courses = await getCourses()

    if ('error' in courses) {
        return (
            <div className='w-full h-full grid place-items-center p-6'>
                <div className='bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 w-full max-w-md text-center flex flex-col items-center gap-6'>
                    <h1 className='text-2xl font-semibold text-login-100/50'>
                        No Courses
                    </h1>
                    <p className='text-gray-300 text-sm px-8'> There are no courses. Add a course, or try again later if you know there are courses.</p>
                    <Link href='/add/course' className='rounded-lg py-1 px-6 bg-login-500 hover:bg-login-400 font-semibold transition-colors shadow-md text-login-100' >
                        Add Course
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='relative h-full rounded-lg overflow-auto noscroll flex justify-center items-center'>
            <div className='bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg py-3 px-4 w-full max-w-2xl text-center flex flex-col items-center gap-2 h-[calc(100vh-20rem)] xs:h-120 xs:w-96'>
                <h1 className='text-center font-semibold py-2'>Select course</h1>
                <div className='flex flex-col w-full h-full rounded-md p-2 overflow-auto noscroll gap-2'>
                    <div className='grid gap-2'>
                        {courses.map((course) => <Link
                            href={`${isEdit ? '/edit' : '/course'}/${course.code}`}
                            key={course.id}
                            className='text-2xs md:text-base bg-login-300/10 hover:bg-login-300/20 w-full rounded-md p-1 px-2 md:p-2 h-7 md:h-auto flex justify-between items-center overflow-hidden'
                        >
                            <div className='flex gap-1 whitespace-nowrap min-w-0 flex-1'>
                                <h1 className='truncate'>{course.code} - {course.name}</h1>
                            </div>
                            <h1 className='text-login-100/30'>({course.cardCount} cards)</h1>
                        </Link>)}
                    </div>
                </div>
                <Link
                    href='/add/course'
                    className={`
                        bg-login-100/10 hover:bg-login-100/20 w-fit text-2xs 
                        px-6 py-0.5 grid place-items-center rounded-lg shadow-lg
                        md:text-base backdrop-blur-md outline outline-login-100/30
                `}
                >
                    Add course
                </Link>
            </div>
            {typeof config.version !== 'undefined' ? (
                <Link
                    className='absolute right-2 bottom-2 bg-[rgba(200,200,200,0.1)] px-[0.6rem] py-[0.4rem] rounded-md text-white tracking-[0.05em] font-semibold'
                    target='_blank'
                    href={`${config.url.GITLAB_URL}/tekkom/web/beehive/exam.login.no/-/tags/${config.version}`}
                >
                    v{config.version}
                </Link>
            ) : null}
        </div>
    )
}
