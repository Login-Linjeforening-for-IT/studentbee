import React, { useState } from 'react'
import Editor from '../editor/editor'
import MarkAsMultipleChoice from './markAsMultipleChoice'
import { updateFile } from '@parent/src/utils/fetchClient'

type StudyProps = {
    courseCode: string
    courseId: number | null
    fileId: number | null
    value: string[]
    name?: string
}

export default function Study({ courseCode, courseId, fileId, value }: StudyProps) {
    const [content, setContent] = useState<string[]>(value)

    function handleChange(text: string) {
        setContent(text.split('\n'))
    }

    function save() {
        if (!courseId || !fileId) {
            return
        }

        updateFile({ id: fileId, content: content.join('\n') })
    }

    return (
        <div className='col-span-8 bg-login-900 rounded-2xl p-8 h-full overflow-auto noscroll border border-login-800/50 shadow-sm'>
            <div className='flex flex-cols justify-between items-center mb-6 pb-4 border-b border-login-800/50'>
                <h1 className='text-2xl font-bold text-login-100'>
                    Learning Material <span className='text-login-400 text-lg font-normal'>for {courseCode}</span></h1>
                <MarkAsMultipleChoice courseId={courseCode} />
            </div>
            <p className='text-md text-login-300 mb-6 bg-login-950/50 p-4 rounded-lg border border-login-800/30'>
                This course allows examination aids, and is not a multiple choice based exam.
            </p>
            <Editor
                courseId={String(courseId ?? '')}
                value={value}
                customSaveLogic={true}
                save={save}
                className='min-h-[68vh]'
                placeholderClassName='placeholder-login-50'
                onChange={handleChange}
            />
        </div>
    )
}
