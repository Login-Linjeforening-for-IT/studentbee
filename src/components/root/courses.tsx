import { getCourses } from "@utils/fetch"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import StudyOrTest from "./studyOrTest"

export default async function Courses() {
    const courses = await getCourses('server')

    if (typeof courses === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div className='w-full h-full rounded-xl col-span-2 overflow-auto grid grid-rows-12 noscroll'>
            <div className="row-span-11 pb-4">
                <div className="h-full bg-dark p-4 overflow-auto rounded-xl">
                    <Header />
                    <StudyOrTest courses={courses} />
                </div>
            </div>
            <ToolTipsButton />
        </div>
    )
}