'use client'

import Link from "next/link"
import Edit from "./edit"
import { usePathname } from "next/navigation"
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { deleteFile, sendFile } from "@/utils/fetchClient"
import { getFiles } from "@/utils/fetch"
import getItem from "@/utils/localStorage"
import Trash from "../svg/trash"

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
    inputRef: MutableRefObject<HTMLInputElement | null>
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
    inputRef: MutableRefObject<HTMLInputElement | null>
    createFile: () => void
}

type ButtonProps = {
    text: string
    href: string
    target?: string
}

export default function StudyOrTest({courses}: CoursesProps) {
    const path = usePathname()
    const [study, setStudy] = useState(true)
    const [cardCount, setCardCount] = useState(0)

    useEffect(() => {
        setStudy(path.includes('study') || path.includes('files') || getItem('leftnav') === 'study')
        const name = path.split('/')[2] || ''
        const amountOfCards = courses.find(course => course.id === name)?.cards.length || 0
        setCardCount(amountOfCards)
    }, [path])

    return (
        <div className="h-full">
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
            inputRef.current.value = ""
        }
    }

    useEffect(() => {
        async function fetchFiles() {
            const response = await getFiles(course)
            response && setFiles(response)
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
        <div className="w-full grid grid-rows-auto">
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
            {course === 'IDATG2204' && <Button text='/ sql-practice' href='https://sql-practice.com' target="_blank" />}
            <div className="flex flex-rows group">
                <Button text='/ study' href={`/course/${course}/study`} />
                <button 
                    className="text-xl opacity-0 group-hover:opacity-100 text-end text-bright" 
                    onClick={() => setDisplayInputField(displayInputField.length ? '' : 'root')}
                >
                    +
                </button>
            </div>
            {displayInputField === 'root' && <div className="grid grid-cols-4">
                <input 
                    ref={inputRef}
                    className="bg-transparent col-span-3 border-b-2 border-bright text-bright outline-hidden caret-orange-500" 
                    maxLength={20} 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                />
                <button 
                    className="text-end text-bright" 
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
            className="text-lg rounded-md mr-2 text-bright w-full"
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
        <div className="grid w-full">
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
            inputRef.current.value = ""
        }
    }

    function handleDelete() {
        deleteFile({courseID: course, name: file.name})
    }

    return (
        <div className={className || "grid space-between"}>
            <button className="text-bright grid grid-cols-5 group" key={file.name}>
                <Link 
                    href={`/course/${course}/files/${file.name}`} 
                    className="text-start pl-4 text-lg col-span-4"
                >
                    / {file.name}
                </Link>
                <div className="flex flex-rows float-end justify-end space-x-1">
                    <h1
                        className="text-end text-xl opacity-0 group-hover:opacity-100 hover:text-green-500" 
                        onClick={handleDisplayInput}
                    >
                        +
                    </h1>
                    <h1 
                        className="text-xl opacity-0 group-hover:opacity-100 text-end w-[1.3vw] place-self-center" 
                        onClick={handleDelete}
                    >
                        <Trash 
                            fill="fill-bright hover:fill-red-500" 
                            className="w-full h-full" 
                        />
                    </h1>
                </div>
            </button>
            {file.files.map((file) => <File 
                className="pl-4 w-full grid space-between" 
                key={file.name} 
                file={file} 
                path={path}
                input={input}
                setInput={setInput}
                inputRef={inputRef}
                displayInputField={displayInputField}
                setDisplayInputField={setDisplayInputField}
            /> )}
            {displayInputField === file.name && <div className="grid grid-cols-4 pl-4">
                <input 
                    ref={inputRef}
                    className={'bg-transparent col-span-3 border-b-2 border-bright text-bright outline-hidden caret-orange-500'} 
                    maxLength={20} 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                />
                <button className="text-end text-bright" onClick={addFile}>
                    Add
                </button>
            </div>}
        </div>
    )
}

function InnerCourseList({courses, currentPath}: CoursesProps) {
    return (
        <div className="flex flex-col h-full min-h-0 pb-[6rem]">
            <div className="shrink-0 border-b-2 border-light">
                <div className="flex flex-cols mb-2">
                    <h1 className="text-xl mr-2">Courses</h1>
                    <Link 
                        href='/add/course' 
                        className="hidden rounded-md lg:grid text-base self-center mr-2 bg-light px-2"
                    >
                        Add
                    </Link>
                    <Edit />
                </div>
            </div>
            <div className="pt-[0.5rem] overflow-auto grow noscroll">
            {courses.map(course =>
                <Course key={course.id} course={course} currentPath={currentPath} /> 
            )}
            </div>
        </div>
    )
}

function Course({course, currentPath}: CourseProps) {
    const currentCourse = currentPath.includes("/course/") ? currentPath.split("/course/")[1].split("/")[0] : ''
    return (
        <Link 
            href={`/course/${course.id}`} 
            className={`flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] hover:pl-[1.5rem] duration-[500ms] transition-[padding] ${currentCourse === course.id ? '*:fill-login text-login pl-[1.2rem] border-l-[0.3rem]' : '' } hover:*:fill-login hover:text-login font-medium`}
        >
            <h1>{course.id}</h1>
        </Link>
    )
}