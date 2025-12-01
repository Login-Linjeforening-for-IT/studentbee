import { getFile } from '@parent/src/utils/fetch'
import CourseClient from '@parent/src/components/course/courseClient'
import CourseList from '@parent/src/components/root/courses'
import SelectCourseList from '@parent/src/components/list/list'
import { getCourse, getComments } from '@utils/api'

export default async function Course(props: { params: Promise<{ id?: string[] }> }) {
    const params = await props.params
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id

    if (!id) {
        return <SelectCourseList />
    }

    const idArray = Array.isArray(params?.id) ? params.id : []
    const IDasString = idArray[1] || '1'
    const current = Number(IDasString) - 1
    const course = await getCourse(id)
    const fileContent = await getFile(id, idArray[2] || 'root')
    const comments = await getComments(id)


    return (
        <div className='grid grid-cols-10 gap-2 w-full h-full max-h-full'>
            <div className='hidden md:grid! rounded-lg col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <CourseList />
            </div>
            <div className='col-span-8 h-full overflow-auto grid place-items-center w-full gap-2'>
                <CourseClient
                    course={'error' in course ? null : course}
                    id={id}
                    current={current}
                    comments={'error' in comments ? [] : comments}
                    fileContent={fileContent.split('\n')}
                />
            </div>
        </div>
    )
}
