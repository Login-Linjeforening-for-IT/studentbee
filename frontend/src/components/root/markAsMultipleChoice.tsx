'use client'

import { sendMark } from '@parent/frontend/src/utils/fetchClient'

export default function MarkAsMultipleChoice({courseID}: {courseID: string}) {
    function markCourse() {
        sendMark({courseID, mark: false})
    }

    return (
        <button className='text-md bg-login-700 px-2 rounded-xl text-login-300' onClick={markCourse}>Convert to multiple choice</button>
    )
}
