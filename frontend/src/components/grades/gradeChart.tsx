'use client'

import { useEffect, useRef, useState } from 'react'

type GradeProp = Record<string, number>

type GradesProps = {
    selectedYear: number
    years: number[]
    grades: Record<number, GradeProp>
}

export default function GradeChart({ grades, years, selectedYear }: GradesProps) {
    const currentGrades = grades[selectedYear]
    const totalCandidatesAlp = (currentGrades.A || 0) + (currentGrades.B || 0) + (currentGrades.C || 0) + (currentGrades.D || 0) + (currentGrades.E || 0) + (currentGrades.F || 0)
    const totalCandidatesBin = (currentGrades.G || 0) + (currentGrades.H || 0)

    const sortedYears = [...years].reverse()
    const failRatioData = sortedYears.map(year => {
        const g = grades[year]
        const totalAlp = (g.A || 0) + (g.B || 0) + (g.C || 0) + (g.D || 0) + (g.E || 0) + (g.F || 0)
        const totalBin = (g.G || 0) + (g.H || 0)

        if (totalAlp > 0) return (g.F || 0) / totalAlp * 100
        if (totalBin > 0) return (g.H || 0) / totalBin * 100
        return null
    })

    const avgGradeData = sortedYears.map(year => {
        const g = grades[year]
        const totalAlp = (g.A || 0) + (g.B || 0) + (g.C || 0) + (g.D || 0) + (g.E || 0) + (g.F || 0)

        if (totalAlp > 0) {
            const sum = (g.A || 0) * 5 + (g.B || 0) * 4 + (g.C || 0) * 3 + (g.D || 0) * 2 + (g.E || 0) * 1 + (g.F || 0) * 0
            return sum / totalAlp
        }
        return null
    })

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[1.5fr_1fr] gap-2 w-full h-full overflow-y-auto lg:overflow-hidden p-1'>
            {/* Bar Chart Section */}
            <div className='w-full bg-login-900 p-2 rounded-lg border border-login-800 lg:col-span-2 flex flex-col min-h-[140px] lg:min-h-0 lg:h-full'>
                <h3 className='text-login-100 text-[10px] font-semibold mb-1 text-center uppercase tracking-wider shrink-0'>Grade Distribution ({selectedYear})</h3>
                <div className='grow min-h-0 w-full'>
                    {totalCandidatesAlp > 0 ? (
                        <BarChart
                            data={[
                                { label: 'A', value: currentGrades.A || 0, color: '#4ade80B3' }, // Green 400 70%
                                { label: 'B', value: currentGrades.B || 0, color: '#a3e635B3' }, // Lime 400 70%
                                { label: 'C', value: currentGrades.C || 0, color: '#facc15B3' }, // Yellow 400 70%
                                { label: 'D', value: currentGrades.D || 0, color: '#fb923cB3' }, // Orange 400 70%
                                { label: 'E', value: currentGrades.E || 0, color: '#f87171B3' }, // Red 400 70%
                                { label: 'F', value: currentGrades.F || 0, color: '#ef4444B3' }, // Red 500 70%
                            ]}
                            total={totalCandidatesAlp}
                        />
                    ) : totalCandidatesBin > 0 ? (
                        <BarChart
                            data={[
                                { label: 'Pass', value: currentGrades.G || 0, color: '#4ade80B3' },
                                { label: 'Fail', value: currentGrades.H || 0, color: '#ef4444B3' },
                            ]}
                            total={totalCandidatesBin}
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-login-200 text-xs'>No data for this year</div>
                    )}
                </div>
            </div>

            {/* Line Charts Section */}
            <div className='w-full bg-login-900 p-2 rounded-lg border border-login-800 flex flex-col min-h-[120px] lg:min-h-0 lg:h-full'>
                <h3 className='text-login-100 text-[10px] font-semibold mb-1 text-center uppercase tracking-wider shrink-0'>Fail Percentage</h3>
                <div className='grow min-h-0'>
                    <LineChart
                        data={failRatioData}
                        labels={sortedYears}
                        selectedYear={selectedYear}
                        color='#F87171'
                        formatY={(val) => `${Math.round(val)}%`}
                    />
                </div>
            </div>

            <div className='w-full bg-login-900 p-2 rounded-lg border border-login-800 flex flex-col min-h-[120px] lg:min-h-0 lg:h-full'>
                <h3 className='text-login-100 text-[10px] font-semibold mb-1 text-center uppercase tracking-wider shrink-0'>Average Grade</h3>
                <div className='grow min-h-0'>
                    <LineChart
                        data={avgGradeData}
                        labels={sortedYears}
                        selectedYear={selectedYear}
                        color='#FDBA74'
                        formatY={(val) => {
                            const letters = ['F', 'E', 'D', 'C', 'B', 'A']
                            return letters[Math.round(val)] || ''
                        }}
                        min={0}
                        max={5}
                    />
                </div>
            </div>
        </div>
    )
}

function BarChart({ data, total }: { data: { label: string, value: number, color: string }[], total: number }) {
    const maxVal = Math.max(...data.map(d => d.value))

    return (
        <div className='w-full h-full flex items-end justify-between gap-2 px-2'>
            {data.map((d, i) => {
                const percentage = total > 0 ? (d.value / total) * 100 : 0
                const heightPct = maxVal > 0 ? (d.value / maxVal) * 100 : 0

                return (
                    <div key={i} className='flex flex-col items-center h-full flex-1 group relative'>
                        {/* Bar Container */}
                        <div className='w-full grow flex items-end justify-center relative'>
                            {/* Tooltip */}
                            <div className='absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-login-800 text-login-50 text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap border border-login-700 z-10'>
                                {d.value} ({Math.round(percentage)}%)
                            </div>

                            <div
                                className='w-full rounded-t-sm transition-all duration-500 ease-out hover:brightness-110'
                                style={{
                                    height: `${heightPct}%`,
                                    backgroundColor: d.color,
                                    minHeight: d.value > 0 ? '4px' : '0'
                                }}
                            />
                        </div>

                        {/* Labels */}
                        <div className='flex flex-col items-center justify-start pt-2'>
                            <span className='text-xs font-bold text-login-100'>{d.label}</span>
                            <span className='text-[10px] text-login-200'>{Math.round(percentage)}%</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function LineChart({
    data,
    labels,
    selectedYear,
    color,
    formatY,
    min,
    max
}: {
    data: (number | null)[],
    labels: number[],
    selectedYear: number,
    color: string,
    formatY: (val: number) => string,
    min?: number,
    max?: number
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect()
                setDimensions({ width, height })
            }
        }

        updateDimensions()

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length > 0) {
                window.requestAnimationFrame(updateDimensions)
            }
        })

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        return () => resizeObserver.disconnect()
    }, [])

    const { width, height } = dimensions
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }

    const validData = data.filter(d => d !== null) as number[]
    const dataMin = min !== undefined ? min : Math.min(...validData, 0)
    const dataMax = max !== undefined ? max : Math.max(...validData, 100)
    const range = dataMax - dataMin || 1

    const getX = (index: number) => {
        if (width === 0) return 0
        return padding.left + (index / (labels.length - 1)) * (width - padding.left - padding.right)
    }

    const getY = (val: number) => {
        if (height === 0) return 0
        return height - padding.bottom - ((val - dataMin) / range) * (height - padding.top - padding.bottom)
    }

    const points = data.map((val, i) => {
        if (val === null) return null
        return { x: getX(i), y: getY(val) }
    }).filter((p): p is {x: number, y: number} => p !== null)

    const getSmoothPath = (points: {x: number, y: number}[]) => {
        if (points.length === 0) return ''
        if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

        let d = `M ${points[0].x} ${points[0].y}`

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1]
            const p1 = points[i]
            const p2 = points[i + 1]
            const p3 = points[i + 2] || p2

            const tension = 0.2
            const cp1x = p1.x + (p2.x - p0.x) * tension
            const cp1y = p1.y + (p2.y - p0.y) * tension
            const cp2x = p2.x - (p3.x - p1.x) * tension
            const cp2y = p2.y - (p3.y - p1.y) * tension

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
        }
        return d
    }

    const pathD = getSmoothPath(points)

    return (
        <div ref={containerRef} className='w-full h-full min-h-[150px] relative'>
            {(width > 0 && height > 0) && (
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className='absolute inset-0 w-full h-full overflow-visible'
                    preserveAspectRatio='none'
                >
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(t => {
                        const val = dataMin + t * range
                        const y = getY(val)
                        return (
                            <g key={t}>
                                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke='#333' strokeWidth='1' strokeDasharray='4 4' />
                                <text x={padding.left - 5} y={y + 4} textAnchor='end' className='text-[10px] fill-login-200 font-mono'>
                                    {formatY(val)}
                                </text>
                            </g>
                        )
                    })}

                    {labels.map((year, i) => {
                        const step = Math.ceil(labels.length / 5)
                        if (i % step !== 0 && i !== labels.length - 1) return null

                        return (
                            <text key={year} x={getX(i)} y={height - 5} textAnchor='middle' className='text-[10px] fill-login-200 font-mono'>
                                {year}
                            </text>
                        )
                    })}

                    {/* The Line */}
                    <path
                        d={pathD}
                        fill='none'
                        stroke={color}
                        strokeWidth='4'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />

                    {/* Data Points */}
                    {data.map((val, i) => {
                        if (val === null) return null
                        const isSelected = labels[i] === selectedYear
                        return (
                            <circle
                                key={i}
                                cx={getX(i)}
                                cy={getY(val)}
                                r={isSelected ? 6 : 3}
                                fill={isSelected ? color : '#181818'}
                                stroke={color}
                                strokeWidth='2'
                                className='transition-all duration-300'
                            />
                        )
                    })}
                </svg>
            )}
        </div>
    )
}
