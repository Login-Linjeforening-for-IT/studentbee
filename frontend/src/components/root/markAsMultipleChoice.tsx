'use client'

import { sendMark } from '@parent/src/utils/fetchClient'

export default function MarkAsMultipleChoice({ courseId }: { courseId: string }) {
    function markCourse() {
        sendMark({ courseId, learningBased: false })
    }

    return (
        <button className='text-md bg-login-700 px-2 rounded-lg text-login-300' onClick={markCourse}>
            Convert to multiple choice
        </button>
    )
}
