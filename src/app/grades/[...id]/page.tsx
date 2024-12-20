'use client'

import { useEffect, useState } from "react"
import { getGrades } from "@/utils/fetch"
import Graphs from "@components/grades/grahp"
import Slider from "@components/grades/slider"
import Link from "next/link"

export default function Grades({ params }: { params: { id: string[] } }): JSX.Element {

    const course = params.id[0]
    const [selectedYear, setSelectedYear] = useState<null | number>(null)
    const [years, setYears] = useState<number[] | null>(null)
    const [data, setData] = useState<any | null>(null)
    const [grades, setGrades] = useState()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        setIsLoading(true) 
        async function fetchGrades() {
            const fetchedGrades = await getGrades(course)
            if (typeof(fetchedGrades) != "string") {
                setData(fetchedGrades)
                setError(null)
            } else {
                setError('No grades found')
                throw new Error('No grades found')
            }
            setIsLoading(false) 
        }
        
        fetchGrades()
    }, [course])

    useEffect(() => {
        if(data){
            
            const availableYears = [];
            for (let i = 1; i < data.length; i++) {
                if (availableYears.indexOf(data[i].Årstall) === -1) {
                    availableYears.push(data[i].Årstall);
                }
            }
            setYears(availableYears.reverse())
            setSelectedYear(availableYears[0])

            const transformedData = {} as any;
            for (let i = 0; i < availableYears.length; i++) {
                const year = availableYears[i];
    
                if (!transformedData[year]) {
                    transformedData[year] = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 };
                }
    
                for (let j = 0; j < data.length; j++) {
                    const item = data[j];
    
                    if (item.Årstall === year) {
                        const grade = item.Karakter;
                        const totalCandidates = parseInt(item["Antall kandidater totalt"], 10);
    
                        if (transformedData[year][grade] !== undefined) {
                            transformedData[year][grade] += totalCandidates;
                        }
                    }
                }
            }
    
            setGrades(transformedData);
        }
    }, [data]);
    
    return (
        <main className="grid place-items-center h-full]">
            <div className="w-full h-full grid place-items-center">
                <h1 className="grid place-items-center text-4xl font-bold mb-8">Grades - {course}</h1>
                { error && <p>{error}</p> }
                { !error && isLoading && <p>Loading...</p>}

                {!isLoading && selectedYear && years && grades && <Graphs grades={grades} years={years} sYear={selectedYear} />}

                {!isLoading && selectedYear && years && <Slider years={[...years].reverse()} selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>}

            </div>
        </main>
    )
}
