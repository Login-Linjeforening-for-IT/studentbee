import React, { useState } from "react";

type SliderProps = {
    years: number[]
    selectedYear: number | null
    setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>
}

export default function Slider({ years, selectedYear, setSelectedYear }: SliderProps){
    const positions = years; 

   function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = Number(event.target.value);

        const closestValue = positions.reduce((prev, curr) =>
            Math.abs(curr - inputValue) < Math.abs(prev - inputValue) ? curr : prev
        );

        setSelectedYear(closestValue);
    };

     return (
        <div className="flex flex-col items-center w-full max-w-md mt-6">
        {/* Slider */}
        <input
            type="range"
            min={Math.min(...positions)} 
            max={Math.max(...positions)}
            value={selectedYear??undefined}
            onChange={handleChange}
            step={1}
            className="w-full h-2 bg-[rgb(60,60,60)] rounded-lg outline-hidden appearance-none"
        />
        {/* Thumb styling */}
        <style>
            {`
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background-color: rgb(240, 134, 64);
                border-color: rgb(60, 60, 60);
                border-radius: 50%;
                cursor: pointer;
            }
            input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background-color: rgb(240, 134, 64);
                border-color: rgb(60, 60, 60);
                border-radius: 50%;
                cursor: pointer;
            }
            `}
        </style>

        <div className="flex justify-between w-full mt-2 text-sm text-gray-300">
            {positions.map((pos) => (
                
                <span className={pos==selectedYear?"font-bold":""} key={pos}>{pos}</span>
            ))}
        </div>

        </div>
    )
}

