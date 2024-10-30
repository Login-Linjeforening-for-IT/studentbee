'use client'

import { useEffect, useState } from "react"
import { getGrades } from "@/utils/fetch"
import Graph from "@components/grades/graph"
import Link from "next/link"

export default function Grades({ params }: { params: { id: string[] } }): JSX.Element {

    const course = params.id[0]
    const [graphType, setGraphType] = useState("grades")
    const [selectedYear, setSelectedYear] = useState("0")
    const [years, setYears] = useState([] as string[])
    const [data, setData] = useState({} as {[key: string]: any})
    const [grades, setGrades] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchGrades() {
            const fetchedGrades = await getGrades(course, 'client') as {[key: string]: any}
            if(typeof fetchedGrades !== 'string'){
                setData(fetchedGrades)
                setGraphType("grades")
                setYears(Object.keys(fetchedGrades).sort().reverse() as [])
            }
        }
        fetchGrades()
    }, [course])


    useEffect(() => {
        if (years.length == 0) return

        if(selectedYear == "0" || selectedYear == undefined )
            setSelectedYear(years[0])
        if(data[selectedYear] != undefined)
            setGrades(data[selectedYear])      
    }, [years,selectedYear, data])


    useEffect(() => {
        setIsLoading(true)        
        if(graphType == "grades" && selectedYear != "0" && selectedYear != undefined){
                setGrades(data[selectedYear])
        }else if(graphType == "failRate"){
            let failRate = {} as {[key: string]: number}
                
            years.reverse().forEach((year) => {
                if(Object.values(data[year]).length == 6){ 
                    failRate[year] = data[year]["f"]
                }
                if(Object.values(data[year]).length == 2){ 
                    failRate[year] = data[year]["fail"]
                }
            })
            setGrades(failRate)
        }
        setIsLoading(false)
    }, [graphType])
    
    return (
        <main className="grid place-items-center h-full]">
            <div className="w-full h-full grid place-items-center">
                <h1 className="grid place-items-center text-4xl font-bold mb-8">Grades - {course}</h1>
                
                {Object.keys(grades).length === 0 ? <p>No data available</p> : (<>
                
                    <div className="flex flex-row pb-2">
                        <button className="underline" type="button" onClick={() => {setGraphType("grades"); setIsLoading(true)}}>Grades</button>
                        <p className="px-4">|</p>
                        <button className="underline" type="button" onClick={() => {setGraphType("failRate"); setIsLoading(true)}}>Fail rate</button>
                    </div>

                    {graphType == "grades" && (
                        <label> Select year: 
                            <select
                                className="bg-normal pl-2"
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}>
                                {years.map((year) => (
                                    <option value={year}>{year}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    {isLoading ? null : <Graph graphType={graphType} grades={grades} />}
                </>)}
                <Link href={`../../addGrades/${course}`}>
                    <button className="mt-2 p-2 w-full bg-orange-500 rounded-xl text-xl h-[5vh] place-items-center"> Add statistics</button>
                </Link>
            </div>
        </main>
    )
}
