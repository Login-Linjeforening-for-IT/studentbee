import { useEffect, useState } from "react"

type GradeProps = {
    graphType: string
    grades: {
        A: number,
        B: number,
        C: number,
        D: number,
        E: number,
        F: number,
        G: number,
        H: number
    }
}

export default function Graph({ graphType, grades}: GradeProps) {
    
    const SVGWidth = 600
    const SVGHeight = 400

    const gradesKeys = Object.keys(grades) 
    const gradesValues = Object.values(grades)

    const x0 = 50
    const xAxisLength = SVGWidth - x0 * 2

    const y0 = 50
    const yAxisLength = SVGHeight - y0 * 2

    const xAxisY = y0 + yAxisLength

     
    const dataYMax = Math.ceil( Math.max(...gradesValues) / 10) * 10

    const numYTicks = dataYMax / 5

    const barPlotWidth = xAxisLength / gradesKeys.length



    const gradeGraph = () => {
        return (
            <g>
            {gradesValues.map((dataY, index) => {
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
                    fill="white"
                    className="capitalize">
                    

                    {gradesKeys[index]}
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
            {gradesValues.map((dataY, index) => {

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
                            fill="white"
                            className="capitalize">
                            

                            {gradesKeys[index]}
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
        {graphType==="grades" && gradeGraph()}
        {graphType==="failRate" && failRateGraph()}
        </svg>
    )
}
