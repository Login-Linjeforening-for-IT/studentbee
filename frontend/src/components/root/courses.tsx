import ToolTipsButton from './toolTipsButton'
import Header from './header'
import StudyOrTest from './studyOrTest'
import { getCourses } from '@utils/api'

export default async function CourseList() {
    const courses = await getCourses()

    if ('error' in courses) {
        return (
            <div className='col-span-2 bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center gap-6 grid place-items-center self-center'>
                <h1 className='text-lg font-semibold'>Course List Unavailable</h1>
                <h1 className='px-8'>The course list is currently unavailable. Please try again later.</h1>
                <h1 className='text-sm'>Details: {courses.error}</h1>
            </div>
        )
    }

    return (
        <div className='w-full h-full overflow-hidden flex flex-col'>
            <div className='w-full h-full flex flex-col gap-4 overflow-hidden'>
                <Header />
                <div className='overflow-auto flex-1 rounded-2xl'>
                    <StudyOrTest courses={courses as Courses[]} currentPath={''} />
                </div>
                <ToolTipsButton />
            </div>
        </div>
    )
}