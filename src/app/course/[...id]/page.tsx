import React from 'react'
import Courses from '@components/root/courses'
import Cards from '@/components/root/cards'
import Elements from '@/components/root/elements'
import { getCourse } from '@/utils/fetch'
import getComments from '@/utils/comments'
import LearningMaterial from '@/components/root/learningMaterial'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Course({ params }: { params: { id: string[] } }) {
    const id = params.id[0]
    const current = Number(params.id[1] || 0)
    const course = await getCourse(id, 'server')
    const comments = await getComments(id)
    const learningBased = typeof course === 'object' && course?.mark

    return (
        <div className="w-full h-full rounded-xl overflow-auto grid grid-cols-10 gap-8 noscroll">
            <Courses />
            {learningBased && <LearningMaterial courseID={course.id} text={course.textUnreviewed} />}
            {!learningBased && <div className='col-span-6 w-full h-full'>
                <Cards course={course} id={id} current={current} comments={comments} />
            </div>}
            {!learningBased && <Elements id={id} current={current} />}
        </div>
    )
}
