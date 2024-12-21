'use client'

import { addGrades } from "@utils/fetchClient"
import { useState, useEffect } from "react"

type GradesProps = {
    [key: string]: number
}
type InputProps = {
    [key: string]: any
}

export default function AddGrades({ params }: { params: { id: string[] } }) {
    
    const courseID = params.id[0]
    const [gradeType, setGradeType] = useState("letterGrades")
    const [grades, setGrades] = useState<GradesProps>({})
    const [year, setYear] = useState("")
    const [inputs, setInputs] = useState<InputProps>({})
    const [response, setResponse] = useState("")

    async function handleAddGrades() {
        if (year !== ''){
            const res = await addGrades(courseID, year, grades)
            res.id == courseID ? setResponse("Grades added to " + res.id) : setResponse("Error: "+res)
        }else{
            setResponse(`Enter a valid year (2016-${new Date().getFullYear()})`)
        }
        setYear('')
        gradeType == "letterGrades" ? setGrades({ a:0, b:0, c:0, d:0, e:0, f:0 }) : setGrades({ pass:0, fail:0 }) 
        gradeType == "letterGrades" ? setInputs({ year:'', a:'', b:'', c:'', d:'', e:'', f:'' }) : setInputs({ year:'', pass:'', fail:'' }) 
    }

    useEffect(() => {
        gradeType == "letterGrades" ? setGrades({ a:0, b:0, c:0, d:0, e:0, f:0 }) : setGrades({ pass:0, fail:0 }) 
        gradeType == "letterGrades" ? setInputs({ year:'', a:'', b:'', c:'', d:'', e:'', f:'' }) : setInputs({ year:'', pass:'', fail:'' }) 
    }, [gradeType])

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-dark w-[35vw] rounded-xl grid place-items-center gap-4 p-5 px-10 max-h-[75vh] overflow-hidden">
                
                <div className="flex flex-row">
                        <button className="underline" type="button" onClick={() => setGradeType("letterGrades")}>Letter grades</button>
                        <p className="px-4">|</p>
                        <button className="underline" type="button" onClick={() => setGradeType("binaryGrades")}>Pass / Fail</button>
                </div>
                <div className="grid grid-cols-[max-content_1fr]">
                    <label className="text-right self-center">Year:</label>
                    <input 
                        value={inputs['year']}
                        className="bg-light rounded-xl overflow-hidden outline-none px-4 caret-orange-500 m-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        placeholder="Year"
                        onChange={e => {
                            const value = (Number(e.target.value))
                            const newValue = value >= 2016 && value <= new Date().getFullYear() ? e.target.value : ''
                            setYear(newValue)
                            setInputs(prevInputs => ({ ...prevInputs, ['year']: e.target.value}))}}
                    /> 
                    {Object.keys(grades).map((data) => [
                        <label className="capitalize text-right self-center ">{data}: </label>,
                        <input 
                            value={inputs[data]}
                            className="bg-light rounded-xl overflow-hidden outline-none px-4 caret-orange-500 m-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                            placeholder="Percentage"
                            onChange={e => {
                                const value = (Number(e.target.value))
                                const newValue = value >= 0 && value <= 100 ? value : 0
                                setGrades(prevGrades => ({ ...prevGrades, [data]: newValue}))
                                setInputs(prevInputs => ({ ...prevInputs, [data]: e.target.value})) }}
                        />  
                    ])}
                </div>
                <p>{response}</p>
                <button 
                    className="grid w-full bg-orange-500 rounded-xl text-xl h-[5vh] place-items-center" 
                    onClick={handleAddGrades}
                    >
                    Add grades
                </button>
            </div>  
        </div>
    )
}
