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
        <div className='col-span-8 bg-login-900 rounded-lg p-8 h-full overflow-auto noscroll'>
            <div className='flex flex-cols justify-between'>
                <h1 className='text-xl font-bold'>Learning Material for {courseId}</h1>
                <MarkAsMultipleChoice courseId={courseId} />
            </div>
            <p className='text-md text-login-300'>
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