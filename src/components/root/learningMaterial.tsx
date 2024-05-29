import React from "react"
import { Editor } from "../editor/editor"
import MarkAsMultipleChoice from "./markAsMultipleChoice"

type LearningMaterialProps = {
    courseID: string
    text: string[]
}

export default function LearningMaterial({ courseID, text }: LearningMaterialProps) {

    return (
        <div className="col-span-8 bg-light rounded-xl p-4 h-full overflow-auto noscroll">
            <div className="flex flex-cols justify-between">
                <h1 className="text-2xl font-bold">Learning Material for {courseID}</h1>
                <MarkAsMultipleChoice courseID={courseID} />
            </div>
            <p className="text-md text-bright">
                This course allows examination aids, and is not a multiple choice based exam.
            </p>
            <Editor courseID={courseID} value={text} />
        </div>
    )
}