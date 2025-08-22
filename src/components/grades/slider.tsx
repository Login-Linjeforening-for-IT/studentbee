'use client'

import React, { useState, useEffect } from 'react'

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

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
        <div className='flex flex-col items-center w-full max-w-md mt-6'>
            <input
                type='range'
                min={Math.min(...positions)} 
                max={Math.max(...positions)}
                value={currentValue}
                onChange={handleChange}
                step={1}
                className='w-full h-2 bg-[rgb(60,60,60)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[rgb(240,134,64)] [&::-webkit-slider-thumb]:border-[rgb(60,60,60)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[rgb(240,134,64)] [&::-moz-range-thumb]:border-[rgb(60,60,60)] [&::-moz-range-thumb]:cursor-pointer'
            />

            <div className='flex justify-between w-full mt-2 text-sm text-gray-300'>
                {positions.map((pos) => (
                    <span className={pos === currentValue ? 'font-bold' : ''} key={pos}>{pos}</span>
                ))}
            </div>
        </div>
    )
}
