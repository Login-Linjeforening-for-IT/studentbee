'use client'

import Link from "next/link"
import Edit from "./edit"
import { usePathname } from "next/navigation"
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { deleteFile, sendFile } from "@/utils/fetchClient"
import { getFiles } from "@/utils/fetch"
import getItem from "@/utils/localStorage"
import Image from "next/image"
import Trash from "../svg/trash"

type CoursesProps = {
    courses: CourseAsList[]
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

export default function StudyOrTest({courses}: CoursesProps) {
    const path = usePathname()
    const isStudy = path.includes('study') || path.includes('files') || getItem('leftnav') === 'study'

    return (
        <div className="w-full">
            {isStudy && <Files />}
            {!isStudy && <InnerCourses courses={courses} />}
        </div>
    )
}

function Files() {
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
            if ((activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') && e.key === 'Enter') {
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
            <Link href={`/course/${course}`} className="text-lg rounded-md mr-2 text-bright w-full">/ test</Link>
            <div className="flex flex-rows group">
                <Link href={`/course/${course}/study`} className="text-lg rounded-md mr-2 text-bright w-full">/ study</Link>
                <button className="text-xl opacity-0 group-hover:opacity-100 text-end text-bright" onClick={() => setDisplayInputField(displayInputField.length ? '' : 'root')}>+</button>
            </div>
            {displayInputField === 'root' && <div className="grid grid-cols-4">
                <input 
                    ref={inputRef}
                    className="bg-transparent col-span-3 border-b-2 border-bright text-bright" 
                    maxLength={20} 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                />
                <button className="text-end text-bright" onClick={createFile}>Add</button>
            </div>}
            <FileList files={files} path={path} inputRef={inputRef} />
        </div>
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
                    <h1 className="text-xl opacity-0 group-hover:opacity-100 text-end w-[1.3vw] place-self-center" onClick={handleDelete}>
                        <Trash fill="fill-bright hover:fill-red-500" className="w-full h-full" />
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
                    className={`bg-transparent col-span-3 border-b-2 border-bright text-bright`} 
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

function InnerCourses({courses}: CoursesProps) {
    return (
        <>
            <div className="flex flex-cols mb-2">
                <h1 className="text-xl mr-2">Courses</h1>
                <Link href='/add/course' className="text-xl rounded-md mr-2">+</Link>
                <Edit />
            </div>
            {courses.map(course =>
                <Course key={course.id} course={course} /> 
            )}
        </>
    )
}

function Course({course}: CourseProps) {
    return (
        <Link 
            href={`/course/${course.id}`} 
            className={`w-full h-[5vh] bg-light mb-2 rounded-xl flex items-center pl-4`}
        >
            <h1>{course.id}</h1>
        </Link>
    )
}