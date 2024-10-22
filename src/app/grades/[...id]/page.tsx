"use client"

import { useState } from "react"
import Graph from "@components/grades/graph"


export default function Grades({ params }: { params: { id: string[] } }): JSX.Element {

    const course = params.id[0]
    const [graphType, setGraphType] = useState("grades")

    return (
        <main className="grid place-items-center h-full]">
            <div className="w-full h-full grid place-items-center">
                <h1 className="grid place-items-center text-4xl font-bold mb-8">Grades - {course}</h1>
                <button type="button" onClick={() => setGraphType("grades")}>Grades</button>
                <button type="button" onClick={() => setGraphType("failRate")}>Fail rate</button>
                {graphType=="grades" && <Graph graphType={graphType} course={course}/>}
                {graphType=="failRate" && <Graph graphType={graphType} course={course}/>}
            </div>
        </main>
    )
}
