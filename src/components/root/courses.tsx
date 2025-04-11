import { getCourses } from "@utils/fetch"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import StudyOrTest from "./studyOrTest"

export default async function CourseList() {
    const courses = await getCourses('server')
    const headers = new Headers()
    const path = headers.get('x-current-path') || ''

    if (typeof courses === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div className='w-full h-full overflow-hidden grid grid-rows-12'>
            <div className="w-full row-span-12 mb-4 pt-4 pb-4 flex flex-col h-full px-4 overflow-hidden">
                <div className="h-full noscroll">
                    <Header />
                    <StudyOrTest courses={courses} currentPath={path} />
                </div>
                <div className='absolute bottom-[1rem]'>
                    <ToolTipsButton />
                </div>
            </div>
        </div>
    )
}