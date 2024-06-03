'use client'

import { addCourse } from "@utils/fetchClient"
import Link from "next/link"
import { useState } from "react"

export default function Add({ params }: { params: { item: string[] } }) {
    const item = params.item[0].toUpperCase()

    if (!item) {
        return (
            <Link href='/add/course'>Add course</Link>
        )
    }

    return <AddCourse /> 
}

function AddCourse() {
    const [error, setError] = useState("")
    const emptyCard: Card = {
        question: "",
        alternatives: [""],
        correct: [],
        source: "",
        rating: 0,
        votes: []
    }
    const emptyCourse = {
        id: "",
        cards: [],
        unreviewed: [emptyCard],
        textUnreviewed: [],
    }
    const [course, setCourse] = useState<Course>(emptyCourse)
    const [selected, setSelected] = useState(0)
    const courseIDspan = selected === 0 ? "col-span-12" : "col-span-10"
    const inputText = "text-xl flex items-center justify-start col-span-2"
    const navigate = error.length 
        ? '/add/course/' 
        : course.id.length 
            ? `/course/${course.id}`
            : '/add/course/' 

    function handleCourseNameChange(courseName: string) {
        setCourse({ ...course, id: courseName})
    }

    async function handleAddCourse() {
        const err = await addCourse(course)

        if (typeof err === 'string') {
            setError(err)
        }
    }

    function handleBack() {
        setSelected(0)
    }

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-dark w-[35vw] rounded-xl grid place-items-center gap-4 p-5 px-10 max-h-[75vh] overflow-auto">
                <div className="grid grid-cols-12 w-full">
                    {selected != 0 ? <button 
                        className="text-xl bg-dark rounded-md px-2" 
                        onClick={handleBack}
                    >
                        ⬅️
                    </button> : null}
                    <h1 className={`text-3xl font-semibold ${courseIDspan} text-center`}>Add course</h1>
                    <h1 className={`text-md text-red-500 ${courseIDspan} text-center`}>{error}</h1>
                    {selected != 0 ? <div/> : null}
                </div>
                <div className="grid grid-cols-8 w-full space-between h-[5vh]">
                    <h1 className={inputText}>Course ID:</h1>
                    <input 
                        value={course.id} 
                        onChange={(event) => handleCourseNameChange(event.target.value.toUpperCase())}
                        type="text"
                        placeholder="Course code"
                        className="bg-light rounded-xl overflow-hidden px-2 col-span-6 outline-none caret-orange-500"
                        maxLength={10}
                    />
                </div>
                <Link
                    href={navigate}
                    className="grid w-full bg-orange-500 rounded-xl text-xl h-[5vh] place-items-center" 
                    onClick={handleAddCourse}
                >
                    Add course
                </Link>
            </div>  
        </div>
    )
}
