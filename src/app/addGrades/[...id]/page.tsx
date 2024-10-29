'use client'

import { addGrades } from "@utils/fetchClient"
import { useState, useEffect } from "react"

export default function AddGrades({ params }: { params: { id: string[] } }) {
    
    const courseID = params.id[0]
    const [gradeType, setGradeType] = useState("letterGrades")
    const [grades, setGrades] = useState({})
    const [year, setYear] = useState("")
    const [apiResponse, setApiResponse] = useState()


    async function handleAddCourse() {
        // console.log(grades)
        // await addGrades(courseID, grades)
    }

    useEffect(() => {
        gradeType == "letterGrades" ? setGrades({ a:0, b:0, c:0, d:0, e:0, f:0 }) : setGrades({ pass:0, fail:0 }) 
    }, [gradeType])

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-dark w-[35vw] rounded-xl grid place-items-center gap-4 p-5 px-10 max-h-[75vh] overflow-auto">
                <div className="flex justify-center items-center flex-col w-full">
                    <div className="flex flex-row pb-2">
                        <button className="underline" type="button" onClick={() => setGradeType("letterGrades")}>Letter grades</button>
                        <p className="px-4">|</p>
                        <button className="underline" type="button" onClick={() => setGradeType("binaryGrades")}>Pass / Fail</button>
                    </div>
                    {Object.keys(grades).map((data) => (
                        <label className="capitalize">{data}: 
                            <input 
                                type="number"
                                className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                onChange={e => setGrades(prevGrades => ({ ...prevGrades, [data]: Number(e.target.value) }))}/> 
                        </label>
                    ))}
                </div>
                <button 
                    className="grid w-full bg-orange-500 rounded-xl text-xl h-[5vh] place-items-center" 
                    onClick={handleAddCourse}
                    >
                    Add grades
                    </button>
            </div>  
        </div>
    )
}
