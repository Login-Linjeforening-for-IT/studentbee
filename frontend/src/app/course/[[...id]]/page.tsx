import { getCourse, getFile } from '@parent/src/utils/fetch'
import getComments from '@parent/src/utils/comments'
import CourseClient from '@parent/src/components/course/courseClient'
import CourseList from '@parent/src/components/root/courses'
import SelectCourseList from '@parent/src/components/list/list'

export default async function Course(props: { params: Promise<{ id?: string[] }> }) {
    const params = await props.params
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id

    if (!id) {
        return <SelectCourseList />
    }

    const idArray = Array.isArray(params?.id) ? params.id : []
    const IDasString = idArray[1] || '1'
    const current = Number(IDasString) - 1
    const course = await getCourse(id, 'server')
    const fileContent = await getFile(id, idArray[2] || 'root')
    const comments = await getComments(id)
    const learningBased = typeof course === 'object' && course?.learningBased

    return (
        <div className='grid grid-cols-10 gap-2 w-full h-full max-h-full'>
            <div className='hidden rounded-xl lg:grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <CourseList />
            </div>
            <div className='col-span-10 lg:col-span-8 max-h-full overflow-auto'>
                <CourseClient
                    course={course}
                    learningBased={learningBased}
                    id={id}
                    current={current}
                    comments={comments}
                    fileContent={fileContent.split('\n')}
                />
            </div>
        </div>
    )
}
