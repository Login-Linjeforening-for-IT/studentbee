'use client'

import { sendMark } from "@/utils/fetchClient"

export default function MarkAsMultipleChoice({courseID}: {courseID: string}) {
    function markCourse() {
        sendMark({courseID, mark: false})
    }
    
    return (
        <button className="text-md bg-light px-2 rounded-xl" onClick={markCourse}>Convert to multiple choice</button>
    )
}