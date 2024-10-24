'use client'

import { addGrades } from "@utils/fetchClient"
import { useState, useEffect } from "react"

export default function AddGrades({ params }: { params: { id: string[] } }) {
    
    const courseID = params.id[0]
    const [gradeType, setGradeType] = useState("letterGrades")
    const [grades, setGrades] = useState({})

    async function handleAddCourse() {
        await addGrades(courseID, grades)
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
                    {gradeType == "letterGrades" ? 
                    <div className="flex flex-col">
                        <label>A: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, a: Number(e.target.value) }))}/> </label>
                        <label>B: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, b: Number(e.target.value) }))}/> </label>
                        <label>C: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, c: Number(e.target.value) }))}/> </label>
                        <label>D: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, d: Number(e.target.value) }))}/> </label>
                        <label>E: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, e: Number(e.target.value) }))}/> </label>
                        <label>F: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, f: Number(e.target.value) }))}/> </label>
                    </div>: null}
                    {gradeType == "binaryGrades" ? 
                    <div className="flex flex-col">
                        <label>Pass: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, pass: Number(e.target.value) }))}/> </label>
                        <label>Fail: <input type="number" className="m-2 bg-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onChange={e => setGrades(prevGrades => ({ ...prevGrades, fail: Number(e.target.value) }))}/> </label>
                    </div>: null}
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
