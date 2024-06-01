'use client'

import Link from "next/link"
import Edit from "./edit"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { sendFile } from "@/utils/fetchClient"
import { getFiles } from "@/utils/fetch"

type CoursesProps = {
    courses: CourseAsList[]
}

type FileProps = {
    file: Files
}

export default function StudyOrTest({courses}: CoursesProps) {
    const path = usePathname()
    const isStudy = path.includes('study')

    return (
        <div className="w-full h-full">
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
    const isStudy = path.includes('study')
    const [displayInputField, setDisplayInputField] = useState(false)
    const [input, setInput] = useState('')

    function createFile() {
        sendFile({courseID: course, name: input})
        setDisplayInputField(false)

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
            <div className="grid grid-cols-4">
                <Link href={`/course/${course}/study`} className="text-lg rounded-md mr-2 text-bright w-full col-span-3">/ study</Link>
                <button className="text-xl text-end text-bright" onClick={() => setDisplayInputField(!displayInputField)}>+</button>
            </div>
            {displayInputField && <div className="grid grid-cols-4">
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
            <FileList files={files} />
        </div>
    )
}

function FileList({files}: FileListProps) {
    if (!files || !Array.isArray(files)) return (<div></div>)

    return (
        <div className="grid w-full">
            {files.map(file => <File key={file.name} file={file} />)}
        </div>
    )
}

function File({file}: FileProps) {
    const path = usePathname()
    const [displayInputField, setDisplayInputField] = useState(false)
    const [input, setInput] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)
    const course = path.split('/')[2] || ''

    function handleDisplayInput() {
        setDisplayInputField(!displayInputField)
    }

    function addFile() {
        sendFile({courseID: course, name: input, parent: file.name})
        setDisplayInputField(false)
        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    return (
        <>
        <button className="text-bright grid grid-cols-5" key={file.name}>
            <Link href={`/course/${course}/files/${file.name}`} className="text-start pl-2 text-lg col-span-4">/ {file.name}</Link>
            <h1 className="text-end text-xl" onClick={handleDisplayInput}>+</h1>
        </button>
        {displayInputField && <div className="grid grid-cols-4 pl-2">
            <input 
                ref={inputRef}
                className="bg-transparent col-span-3 border-b-2 border-bright text-bright" 
                maxLength={20} 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
            />
            <button className="text-end text-bright" onClick={addFile}>Add</button>
        </div>}
        </>
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
        <Link href={`/course/${course.id}`} className={`w-full h-[5vh] bg-light mb-2 rounded-xl flex items-center pl-4`}>
            <h1>{course.id}</h1>
        </Link>
    )
}