'use client'

import { useEffect, useState, use, type JSX } from "react";
import { useRouter } from 'next/navigation'
import { getGrades } from "@/utils/fetch"
import Graphs from "@components/grades/grahp"
import Slider from "@components/grades/slider"
import Search from "@/components/svg/search"

export default function Grades(props: { params: Promise<{ id: string[] }> }): JSX.Element {
    const params = use(props.params);

    const course = params.id[0]
    const [selectedYear, setSelectedYear] = useState<null | number>(null)
    const [years, setYears] = useState<number[] | null>(null)
    const [data, setData] = useState<any | null>(null)
    const [grades, setGrades] = useState()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<null | string>(null)

    const [input, setInput] = useState<string>(course)
    const router = useRouter()

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
                <div className='relative flex flex-row items-center w-[15rem] h-[2rem] mb-[2rem]'>
                    <input 
                        placeholder='Search' 
                        value={input} 
                        onChange={(e)=>setInput(e.target.value)} 
                        onKeyDown={(e)=>{if(e.key=='Enter')router.push(input)}} 
                        className='absolute w-full h-full bg-darker rounded-md border-[1px] border-[rgb(44,44,44)] px-2 py-1 focus:outline-hidden focus:outline-white focus:outline-offset-1 '>
                    </input>
                    <button onClick={()=>{router.push(input)}} className='absolute h-[1.5rem] w-[1.5rem] right-1'><Search fill='fill-white' className='w-full h-full'/></button>
                </div>

                { error && <p className="pt-8">{error}</p> }
                { !error && isLoading && <p className="pt-8">Loading...</p>}

                {!isLoading && selectedYear && years && grades && 
                <div className='w-full max-w-[18rem] xs:max-w-[20rem]'>
                    <Graphs grades={grades} years={years} sYear={selectedYear} />
                    <Slider years={[...years].reverse()} selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>
                </div>
                }

            </div>
        </main>
    )
}
