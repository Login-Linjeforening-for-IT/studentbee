'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { deleteFile, sendFile } from '@/utils/fetchClient'
import { getFiles } from '@/utils/fetch'
import { Trash2 } from 'lucide-react'

type CoursesProps = {
    courses: CourseAsList[]
    currentPath: string
}

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

export default function StudyOrTest({courses}: CoursesProps) {
    const path = usePathname()
    const [study, setStudy] = useState(path.includes('study') || path.includes('files'))
    const [cardCount, setCardCount] = useState(0)

    useEffect(() => {
        setStudy(path.includes('study') || path.includes('files'))
        const name = path.split('/')[2] || ''
        const amountOfCards = courses.find(course => course.id === name)?.cards.length || 0
        setCardCount(amountOfCards)
    }, [path])

    return (
        <div className='h-full'>
            {study && <Files studyable={cardCount > 0} />}
            {!study && <InnerCourseList courses={courses} currentPath={path} />}
        </div>
    )
}

function Files({studyable}: {studyable: boolean}) {
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

        sendFile({courseID: course, name: input})
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
        <div className='w-full bg-login-900 p-2 h-full rounded-xl'>
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
            <FileList files={files} path={path} inputRef={inputRef} />
        </div>
    )
}

function FileListHeader({course, studyable, displayInputField, setDisplayInputField, input, setInput, inputRef, createFile}: FileListHeaderProps) {
    return (
        <>
            {studyable && <Button text='/ test' href={`/course/${course}`} />}
            {course === 'IDATG2204' && <Button text='/ sql-practice' href='https://sql-practice.com' target='_blank' />}
            <div className='flex flex-rows group'>
                <Button text='/ study' href={`/course/${course}/study`} />
                <button
                    className='text-xl opacity-0 group-hover:opacity-100 text-end text-login-300'
                    onClick={() => setDisplayInputField(displayInputField.length ? '' : 'root')}
                >
                    +
                </button>
            </div>
            {displayInputField === 'root' && <div className='grid grid-cols-4'>
                <input
                    ref={inputRef}
                    className='bg-transparent col-span-3 border-b-2 border-login-50 text-login-300 outline-hidden caret-orange-500'
                    maxLength={20}
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className='text-end text-login-300'
                    onClick={createFile}
                >
                    Add
                </button>
            </div>}
        </>
    )
}

function Button({text, href, target}: ButtonProps) {
    return (
        <Link
            href={href}
            className='text-lg rounded-md mr-2 text-login-300 w-full'
            target={target}
        >
            {text}
        </Link>
    )
}

function FileList({files, path, inputRef}: FileListProps) {
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

function File({file, className, path, input, setInput, inputRef, displayInputField, setDisplayInputField}: FileProps) {
    if (file.name === 'root') {
        return
    }

    const course = path.split('/')[2] || ''

    function handleDisplayInput() {
        setDisplayInputField(displayInputField === file.name ? '' : file.name)
    }

    function addFile() {
        sendFile({courseID: course, name: input, parent: file.name})
        setDisplayInputField('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    function handleDelete() {
        deleteFile({courseID: course, name: file.name})
    }

    return (
        <div className={className || 'grid space-between'}>
            <button className='text-login-300 grid grid-cols-5 group' key={file.name}>
                <Link
                    href={`/course/${course}/files/${file.name}`}
                    className='text-start pl-2 text-lg col-span-4'
                >
                    / {file.name}
                </Link>
                <div className='flex flex-rows float-end justify-end space-x-1'>
                    <h1
                        className='text-end text-xl opacity-0 group-hover:opacity-100 hover:text-green-500'
                        onClick={handleDisplayInput}
                    >
                        +
                    </h1>
                    <h1
                        className='text-xl opacity-0 group-hover:opacity-100 text-end w-[1.3vw] place-self-center'
                        onClick={handleDelete}
                    >
                        <Trash2 className='w-full h-full text-login-50 hover:text-red-500' />
                    </h1>
                </div>
            </button>
            {file.files.map((file) => <File
                className='pl-2 w-full grid space-between'
                key={file.name}
                file={file}
                path={path}
                input={input}
                setInput={setInput}
                inputRef={inputRef}
                displayInputField={displayInputField}
                setDisplayInputField={setDisplayInputField}
            /> )}
            {displayInputField === file.name && <div className='grid grid-cols-4 pl-2'>
                <input
                    ref={inputRef}
                    className={'bg-transparent col-span-3 border-b-2 border-login-50 text-login-300 outline-hidden caret-orange-500'}
                    maxLength={20}
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className='text-end text-login-300' onClick={addFile}>
                    Add
                </button>
            </div>}
        </div>
    )
}

function InnerCourseList({courses, currentPath}: CoursesProps) {
    return (
        <div className='h-full bg-login-900 rounded-xl'>
            <div className='pt-[0.5rem] pb-[6rem] h-full overflow-auto grow noscroll'>
                {courses.map((course, index) =>
                    <Course key={course.id} course={course} currentPath={currentPath} index={index} />
                )}
            </div>
        </div>
    )
}

function Course({course, currentPath, index}: CourseProps) {
    const currentCourse = currentPath.includes('/course/') ? currentPath.split('/course/')[1].split('/')[0] : ''
    const current = currentCourse === course.id
    const bg = index % 2 === 0 ? 'bg-login-800' : 'bg-login-900'

    return (
        <Link
            href={`/course/${course.id}`}
            className={`${bg} lg:bg-transparent rounded-lg lg:rounded-none flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] hover:pl-[1.5rem] duration-[500ms] transition-[padding] ${current ? '*:fill-login text-login pl-[1.2rem] border-l-[0.3rem]' : '' } hover:*:fill-login hover:text-login font-medium`}
        >
            <h1>{course.id}</h1>
        </Link>
    )
}
