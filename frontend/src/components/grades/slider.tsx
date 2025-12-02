'use client'

import { useState, useEffect, ChangeEvent } from 'react'

type SliderProps = {
    years: number[]
    selectedYear: number | null
    setSelectedYear: (year: number) => void
}

export default function Slider({ years, selectedYear, setSelectedYear }: SliderProps){
    const positions = years
    const [currentValue, setCurrentValue] = useState<number>(selectedYear ?? Math.min(...positions))

    useEffect(() => {
        if (selectedYear !== null) {
            setCurrentValue(selectedYear)
        }
    }, [selectedYear])

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const inputValue = Number(event.target.value)

        const closestValue = positions.reduce((prev, curr) =>
            Math.abs(curr - inputValue) < Math.abs(prev - inputValue) ? curr : prev
        )

        setCurrentValue(closestValue)

        if (closestValue !== selectedYear) {
            setSelectedYear(closestValue)
        }
    }

    return (
        <div className='flex flex-col items-center w-full mt-2 px-4'>
            <div className='relative w-full h-2 bg-login-800 rounded-lg'>
                <div
                    className='absolute h-full bg-login rounded-lg'
                    style={{ width: `${((currentValue - Math.min(...positions)) / (Math.max(...positions) - Math.min(...positions))) * 100}%` }}
                />
                <input
                    type='range'
                    min={Math.min(...positions)}
                    max={Math.max(...positions)}
                    value={currentValue}
                    onChange={handleChange}
                    step={1}
                    className='absolute w-full h-2 opacity-0 cursor-pointer z-10'
                />
                <div
                    className='absolute h-5 w-5 bg-login border-2 border-login-900 rounded-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 pointer-events-none shadow-md transition-transform hover:scale-110'
                    style={{ left: `${((currentValue - Math.min(...positions)) / (Math.max(...positions) - Math.min(...positions))) * 100}%` }}
                />
            </div>

            <div className='flex justify-between w-full mt-2 text-xs text-login-300 font-mono'>
                {positions.map((pos) => (
                    <span
                        className={`transition-colors ${pos === currentValue ? 'text-login font-bold scale-110' : 'hover:text-login-200'}`}
                        key={pos}
                        onClick={() => {
                            setCurrentValue(pos)
                            setSelectedYear(pos)
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {pos}
                    </span>
                ))}
            </div>
        </div>
    )
}
