'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { deleteFile, getFiles, sendFile } from '@parent/src/utils/fetchClient'
import { Trash2 } from 'lucide-react'
import InnerCourseList from '@components/course/innerCourseList'

type FileProps = {
    file: Files
    className?: string
    path: string
    input: string
    setInput: Dispatch<SetStateAction<string>>
    inputRef: RefObject<HTMLInputElement | null>
    displayInputField: string
    setDisplayInputField: Dispatch<SetStateAction<string>>
}

type FileListHeaderProps = {
    course: string
    studyable: boolean
    displayInputField: string
    setDisplayInputField: Dispatch<SetStateAction<string>>
    input: string
    setInput: Dispatch<SetStateAction<string>>
    inputRef: RefObject<HTMLInputElement | null>
    createFile: () => void
}

type ButtonProps = {
    text: string
    href: string
    target?: string
}

export default function StudyOrTest({ courses }: CoursesListProps) {
    const path = usePathname()
    const [study, setStudy] = useState(path.includes('study') || path.includes('files'))
    const [cardCount, setCardCount] = useState(0)

    useEffect(() => {
        setStudy(path.includes('study') || path.includes('files'))
        const name = path.split('/')[2] || ''
        const amountOfCards = courses.find(course => course.code === name)?.cardCount || 0
        setCardCount(amountOfCards)
    }, [path])

    return (
        <div className='h-full'>
            {study && <Files studyable={cardCount > 0} />}
            {!study && <InnerCourseList courses={courses} currentPath={path} />}
        </div>
    )
}

function Files({ studyable }: { studyable: boolean }) {
    const [files, setFiles] = useState<Files[]>([])
    const inputRef = useRef<HTMLInputElement | null>(null)
    const path = usePathname()
    const course = path.split('/')[2] || ''
    const [displayInputField, setDisplayInputField] = useState('')
    const [input, setInput] = useState('')

    function createFile() {
        if (!course || !input) {
            return
        }

        sendFile({ courseId: course, name: input })
        setDisplayInputField('')

        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    useEffect(() => {
        async function fetchFiles() {
            const response = await getFiles(course)
            if (response) {
                setFiles(response)
            }
        }

        fetchFiles()
    }, [])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const activeElement = document.activeElement
            if (
                (activeElement?.tagName === 'INPUT'
                    || activeElement?.tagName === 'TEXTAREA')
                && e.key === 'Enter'
            ) {
                createFile()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div className='w-full bg-login-900 p-4 h-full rounded-2xl border border-login-800/50 shadow-sm flex flex-col'>
            <FileListHeader
                course={course}
                studyable={studyable}
                displayInputField={displayInputField}
                setDisplayInputField={setDisplayInputField}
                input={input}
                setInput={setInput}
                inputRef={inputRef}
                createFile={createFile}
            />
            <div className='flex-1 overflow-auto noscroll mt-4 -mx-2 px-2'>
                <FileList files={files} path={path} inputRef={inputRef} />
            </div>
        </div>
    )
}

function FileListHeader({ course, studyable, displayInputField, setDisplayInputField, input, setInput, inputRef, createFile }: FileListHeaderProps) {
    return (
        <div className='flex flex-col gap-2 border-b border-login-800/50 pb-4'>
            {studyable && <Button text='/ test' href={`/course/${course}`} />}
            {course === 'IDATG2204' && <Button text='/ sql-practice' href='https://sql-practice.com' target='_blank' />}
            <div className='flex items-center justify-between group rounded-lg hover:bg-login-800/30 pr-2 transition-colors'>
                <Button text='/ study' href={`/course/${course}/study`} className='mb-0!' />
                <button
                    className='w-6 h-6 flex items-center justify-center rounded-md text-login-400 hover:text-login-50 hover:bg-login-700 transition-all opacity-0 group-hover:opacity-100'
                    onClick={() => setDisplayInputField(displayInputField.length ? '' : 'root')}
                >
                    <span className='text-lg leading-none pb-0.5'>+</span>
                </button>
            </div>
            {displayInputField === 'root' && <div className='flex items-center gap-2 mt-2 bg-login-950/50 p-2 rounded-lg border border-login-800/50 animation-fade-in'>
                <input
                    ref={inputRef}
                    className='bg-transparent flex-1 border-b border-login-700 text-login-200 text-sm px-1 py-0.5 outline-hidden focus:border-login-400 placeholder-login-700'
                    maxLength={20}
                    type='text'
                    placeholder='New file name...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className='text-xs font-bold text-login-950 bg-login-400 px-2 py-1 rounded-md hover:bg-login-300 transition-colors'
                    onClick={createFile}
                >
                    Add
                </button>
            </div>}
        </div>
    )
}

function Button({ text, href, target, className }: ButtonProps & { className?: string }) {
    return (
        <Link
            href={href}
            className={`block text-md font-medium text-login-300 hover:text-login-100 px-2 py-1.5 rounded-lg hover:bg-login-800/50 transition-colors ${className || ''}`}
            target={target}
        >
            {text}
        </Link>
    )
}

function FileList({ files, path, inputRef }: FileListProps) {
    const [input, setInput] = useState('')
    const [displayInputField, setDisplayInputField] = useState('')

    if (!files || !Array.isArray(files)) {
        return <div />
    }

    return (
        <div className='grid w-full'>
            {files.map(file => <File
                key={file.name}
                file={file}
                path={path}
                input={input}
                setInput={setInput}
                inputRef={inputRef}
                displayInputField={displayInputField}
                setDisplayInputField={setDisplayInputField}
            />)}
        </div>
    )
}

function File({ file, className, path, input, setInput, inputRef, displayInputField, setDisplayInputField }: FileProps) {
    if (file.name === 'root') {
        return
    }

    const course = path.split('/')[2] || ''

    function handleDisplayInput() {
        setDisplayInputField(displayInputField === file.name ? '' : file.name)
    }

    function addFile() {
        sendFile({ courseId: course, name: input, parent: file.name })
        setDisplayInputField('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    function handleDelete() {
        deleteFile({ courseId: course, name: file.name })
    }

    return (
        <div className={className || 'flex flex-col'}>
            <div className='flex items-center justify-between group rounded-lg hover:bg-login-800/30 pr-2 transition-colors py-0.5' key={file.name}>
                <Link
                    href={`/course/${course}/files/${file.name}`}
                    className='text-left px-2 py-1.5 text-sm font-medium text-login-300 hover:text-login-100 flex-1 truncate transition-colors'
                >
                    / {file.name}
                </Link>
                <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                        className='p-1 rounded hover:bg-login-700 text-login-400 hover:text-green-400 transition-colors'
                        onClick={handleDisplayInput}
                        title='Add file'
                    >
                        +
                    </button>
                    <button
                        className='p-1.5 rounded hover:bg-login-700 text-login-400 hover:text-red-400 transition-colors'
                        onClick={handleDelete}
                        title='Delete file'
                    >
                        <Trash2 className='w-3.5 h-3.5' />
                    </button>
                </div>
            </div>
            <div className='border-l border-login-800 ml-3 pl-1'>
                {file.files.map((file) => <File
                    className='flex flex-col'
                    key={file.name}
                    file={file}
                    path={path}
                    input={input}
                    setInput={setInput}
                    inputRef={inputRef}
                    displayInputField={displayInputField}
                    setDisplayInputField={setDisplayInputField}
                />)}
                {displayInputField === file.name && <div className='flex items-center gap-2 mt-1 mb-2 ml-2 bg-login-950/50 p-1.5 rounded-lg border border-login-800/50 animation-fade-in'>
                    <input
                        ref={inputRef}
                        className='bg-transparent flex-1 border-b border-login-700 text-login-200 text-sm px-1 outline-hidden focus:border-login-400 placeholder-login-700'
                        maxLength={20}
                        type='text'
                        placeholder='Subfile name...'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        className='text-xs font-bold text-login-950 bg-login-400 px-1.5 py-0.5 rounded hover:bg-login-300 transition-colors'
                        onClick={addFile}
                    >
                        Add
                    </button>
                </div>}
            </div>
        </div>
    )
}
