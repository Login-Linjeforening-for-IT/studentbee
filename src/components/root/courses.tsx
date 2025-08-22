import { getCourses } from '@utils/fetch'
import ToolTipsButton from './toolTipsButton'
import Header from './header'
import StudyOrTest from './studyOrTest'

export default async function CourseList() {
    const courses = await getCourses('server')
    const headers = new Headers()
    const path = headers.get('x-current-path') || ''


    if (typeof courses === 'string') {
        return <h1 className='w-full h-full grid place-items-center'>{courses}</h1>
    }

    return (
        <div className='w-full h-full overflow-hidden grid grid-rows-12'>
            <div className='w-full row-span-12 flex flex-col h-full overflow-hidden gap-2'>
                <Header />
                <StudyOrTest courses={courses} currentPath={path} />
                <ToolTipsButton />
            </div>
        </div>
    )
}