import { getGrades } from "@/utils/fetch"
import { useEffect, useState } from "react"


export default function Graph({ graphType, course}: { graphType: string, course: string }) {
    
    const SVGWidth = 600
    const SVGHeight = 400
    
    const [grades, setGrades] = useState({})
    const [selectedYear, setSelectedYear] = useState("2023")

    useEffect(() => {
        async function fetchGrades() {
            try {
                const fetchedGrades = await getGrades(course, 'client')
                if (JSON.stringify(fetchedGrades) !== JSON.stringify(grades)) {
                    setGrades(fetchedGrades);
                }
            } catch (error) {
                console.error("Error fetching grades:", error)
            }
        }

        fetchGrades()

    }, [])

    console.log(JSON.stringify(grades))

    const [isBusy, setBusy] = useState(true)
    const [data, setData] = useState<[string, number][]>([
        ["A", 3],
        ["B", 13],
        ["C", 24],
        ["D", 18],
        ["E", 12],
        ["F", 31]
    ]);

    useEffect(() => {
        setBusy(true)
        if(graphType=="grade"){
            setData([
                ["A", 3],
                ["B", 13],
                ["C", 24],
                ["D", 18],
                ["E", 12],
                ["F", 31]
            ])
        }else if(graphType=="failRate"){
            setData([
                ["2020", 29],
                ["2021", 31],
                ["2022", 36],
                ["2023", 25],
                ["2024", 20],
                ["2025", 16]
            ])
        }
        setBusy(false)
    }, [graphType]);

    const x0 = 50
    const xAxisLength = SVGWidth - x0 * 2

    const y0 = 50
    const yAxisLength = SVGHeight - y0 * 2

    const xAxisY = y0 + yAxisLength

    let dataYMax = data.reduce(
        (currentMax, [_, dataY]) => Math.max(currentMax, dataY),
        -Infinity
    )
    dataYMax = Math.ceil(dataYMax / 10) * 10

    const numYTicks = dataYMax / 5

    const barPlotWidth = xAxisLength / data.length



    const gradeGraph = () => {
        return (
            <g>
            {data.map(([grade, dataY], index) => {
            const x = x0 + index * barPlotWidth
            
            const y = SVGHeight - (y0 + yAxisLength * (dataY / dataYMax))
            const height = yAxisLength * (dataY / dataYMax)

            const sidePadding = 10

            const r = 7.5
            const fontSize = 15

            return (
            <g key={index}>
                <path
                    d={`
                        M${x + sidePadding / 2 - r},${y} 
                        h${(barPlotWidth - sidePadding)} 
                        a${r},${r} 0 0 1 ${r},${r} 
                        v${height - r}
                        h${-(barPlotWidth - sidePadding)}
                        v${-(height - r)} 
                        a${r},${r} 0 0 1 ${r},${-r} 
                        z`}
                    fill="#f08640"
                />
                <text 
                    x={x + barPlotWidth / 2}
                    y={xAxisY - height/2 + fontSize/2}
                    textAnchor="middle"
                    fill="white"
                    fontSize={fontSize+"px"}>
                    
                    {dataY+"%"}
                </text>
                <text 
                    x={x + barPlotWidth / 2}
                    y={xAxisY + 16}
                    textAnchor="middle"
                    fill="white">
                    
                    {grade}
                </text>
            </g>
            )
        })}
        </g>)
    }

    const failRateGraph = () => {

        let y = 0 
        let x = 0

        return (
            <g>
            {data.map(([year, dataY], index) => {

                const lastX = index==0 ? x0 : x
                x = x0 + index * barPlotWidth
            
                const LastY = index==0 ? SVGHeight - (y0 + yAxisLength * (dataY / dataYMax)) : y
                y = SVGHeight - (y0 + yAxisLength * (dataY / dataYMax))

                return (
                    <g>
                        <line 
                            x1={lastX + barPlotWidth/2} y1={LastY}
                            x2={x + barPlotWidth/2} y2={y}
                            stroke="#f08640"
                            strokeWidth="5px" />

                        <circle id={"circle"+index.toString()} r="5" cx={lastX+barPlotWidth/2} cy={LastY} fill="#191919" stroke="#f08640" stroke-width="2" />
                        <circle id={"circle"+index.toString()} r="5" cx={x+barPlotWidth/2} cy={y} fill="#191919" stroke="#f08640" stroke-width="2" />


                        <text 
                            x={x + barPlotWidth / 2}
                            y={xAxisY + 16}
                            textAnchor="middle"
                            fill="white">
                            
                            {year}
                        </text>
                    </g>
                )
            })}
        </g>)
    }



    return (
        <svg width={SVGWidth} height={SVGHeight}>
        {/* X axis */}
            <line
                x1={x0}
                y1={xAxisY}
                x2={x0 + xAxisLength}
                y2={xAxisY}
                stroke="gray"
            />

            <text x={x0 + xAxisLength + 5} y={xAxisY + 4} fill="gray">
                {graphType=="grades" ? "Grade" : "Year"}
            </text>

        {/* Y axis */}
        <line 
            x1={x0}
            y1={y0}
            x2={x0}
            y2={y0 + yAxisLength}
            stroke="gray"
        />
        
        {Array.from({ length: numYTicks }).map((_, index) => {
            const y = y0 + index * (yAxisLength / numYTicks)
            const yValue = dataYMax - index * (dataYMax / numYTicks)

            return (
                <g key={index}>
                    <line x1={x0} y1={y} x2={x0 - 5} y2={y} stroke="gray" />
                    <text x={x0 - 5} y={y + 5} textAnchor="end" fill="white">
                    {yValue}
                    </text>
                </g>
            )
        })}
        <text x={x0} y={y0 - 8} textAnchor="middle" fill="gray">
            %
        </text>

        {/* Plots */}
        {!isBusy && graphType==="grades" && gradeGraph()}
        {!isBusy && graphType==="failRate" && failRateGraph()}
        </svg>
    )

    return (<h1>Test</h1>)
}
