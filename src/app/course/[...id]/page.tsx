import React from 'react'
import { getCourse, getFile } from '@/utils/fetch'
import getComments from '@/utils/comments'
import CourseClient from '@/components/course/courseClient'
import CourseList from '@/components/root/courses'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Course(props: { params: Promise<{ id: string[] }> }) {
    const params = await props.params
    const id = params.id[0]
    const IDasString = params.id[1] || '1'
    const current = Number(IDasString) - 1
    const course = await getCourse(id, 'server')
    const fileContent = await getFile(id, params.id[2] || 'root')
    const comments = await getComments(id)
    const learningBased = typeof course === 'object' && course?.mark

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
