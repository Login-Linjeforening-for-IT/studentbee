import React from "react"
import Editor from "../editor/editor"
import MarkAsMultipleChoice from "./markAsMultipleChoice"

type StudyProps = {
    courseID: string
    value: string[]
}

export default function Study({ courseID, value }: StudyProps) {
    return (
        <div className="col-span-8 bg-dark rounded-xl p-8 h-full overflow-auto noscroll">
            <div className="flex flex-cols justify-between">
                <h1 className="text-2xl font-bold">Learning Material for {courseID}</h1>
                <MarkAsMultipleChoice courseID={courseID} />
            </div>
            <p className="text-md text-bright">
                This course allows examination aids, and is not a multiple choice based exam.
            </p>
            <Editor courseID={courseID} value={value} className="min-h-[68vh]" />
        </div>
    )
}