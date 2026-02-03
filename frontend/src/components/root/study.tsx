import React, { useState } from 'react'
import Editor from '../editor/editor'
import MarkAsMultipleChoice from './markAsMultipleChoice'
import { updateFile } from '@parent/src/utils/fetchClient'
import { usePathname } from 'next/navigation'

type StudyProps = {
    courseId: string
    value: string[]
    name?: string
}

export default function Study({ courseId, value }: StudyProps) {
    const [content, setContent] = useState<string[]>(value)
    const path = usePathname()
    const name = path.split('/')[4]

    function handleChange(text: string) {
        setContent(text.split('\n'))
    }

    function save() {
        updateFile({ courseId, content: content.join('\n'), name: name || 'root' })
    }

    return (
        <div className='col-span-8 bg-login-900 rounded-2xl p-8 h-full overflow-auto noscroll border border-login-800/50 shadow-sm'>
            <div className='flex flex-cols justify-between items-center mb-6 pb-4 border-b border-login-800/50'>
                <h1 className='text-2xl font-bold text-login-100'>Learning Material <span className="text-login-400 text-lg font-normal">for {courseId}</span></h1>
                <MarkAsMultipleChoice courseId={courseId} />
            </div>
            <p className='text-md text-login-300 mb-6 bg-login-950/50 p-4 rounded-lg border border-login-800/30'>
                This course allows examination aids, and is not a multiple choice based exam.
            </p>
            <Editor
                courseId={courseId}
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