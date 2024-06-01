import React, { useState } from "react"
import Editor from "../editor/editor"
import MarkAsMultipleChoice from "./markAsMultipleChoice"
import { updateFile } from "@/utils/fetchClient"
import { usePathname } from "next/navigation"

type StudyProps = {
    courseID: string
    value: string[]
    name?: string
}

export default function Study({ courseID, value }: StudyProps) {
    const [content, setContent] = useState<string[]>(value)
    const path = usePathname()
    const name = path.split('/')[4]

    function handleChange(text: string) {
        setContent(text.split('\n'))
    }

    function save() {
        console.log("called save func", courseID, content.join('\n'), name)
        updateFile({ courseID, content: content.join('\n'), name: name || 'root' })
    }

    return (
        <div className="col-span-8 bg-dark rounded-xl p-8 h-full overflow-auto noscroll">
            <div className="flex flex-cols justify-between">
                <h1 className="text-2xl font-bold">Learning Material for {courseID}</h1>
                <MarkAsMultipleChoice courseID={courseID} />
            </div>
            <p className="text-md text-bright">
                This course allows examination aids, and is not a multiple choice based exam.
            </p>
            <Editor
                courseID={courseID}
                value={value}
                customSaveLogic={true}
                save={save}
                className="min-h-[68vh]"
                placeholderClassName="placeholder-bright"
                onChange={handleChange}
            />
        </div>
    )
}