import React, { useEffect, useState, Dispatch, SetStateAction } from "react"

type AlternativesProps = {
    alternatives: string[]
    selected: number[]
    setSelected: Dispatch<SetStateAction<number[]>>
    animateAnswer: string
    checkAnswer: (
        input: number[], 
        attempted: number[], 
        setAttempted: Dispatch<SetStateAction<number[]>>
    ) => void
    attempted: number[]
    setAttempted: Dispatch<SetStateAction<number[]>>
    correct: number[]
    remainGreen: number[]
    setRemainGreen: Dispatch<SetStateAction<number[]>>
    wait: boolean
}

export default function Alternatives({
    alternatives, 
    selected, 
    animateAnswer, 
    checkAnswer, 
    attempted, 
    setAttempted, 
    correct, 
    setSelected, 
    remainGreen, 
    setRemainGreen, 
    wait
}: AlternativesProps) {
    const [shuffledAlternatives, setShuffledAlternatives] = useState<string[]>([])
    const [indexMapping, setIndexMapping] = useState<number[]>([])

    useEffect(() => {
        // Shuffles alternatives and creates map
        const shuffled = [...alternatives]
        const mapping = shuffled.map((_, index) => index)
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            ;[mapping[i], mapping[j]] = [mapping[j], mapping[i]]
        }
        
        setShuffledAlternatives(shuffled)
        setIndexMapping(mapping)
    }, [alternatives])

    function getColor(index: number): string {
        const originalIndex = indexMapping[index]
        if (remainGreen.includes(originalIndex)) {
            return "bg-green-500"
        }

        if (!wait) {
            for (let i = 0; i < attempted.length; i++) {
                if (correct.includes(originalIndex) && attempted.includes(originalIndex)) {
                    return "bg-green-500"
                }
            }
        }

        if (!wait) {
            if (attempted.includes(originalIndex) && !correct.includes(originalIndex)) {
                return "bg-red-800"
            }
        }

        if (animateAnswer === originalIndex.toString()) {
            if (animateAnswer === correct.toString()) {
                !remainGreen.includes(originalIndex) && setRemainGreen([...remainGreen, originalIndex])
                return "bg-green-500"
            }
        }

        if (selected.includes(originalIndex)) {
            return "bg-extralight"
        }
        
        return "bg-light"
    }

    return (
        <div className='w-full'>
            {shuffledAlternatives.map((answer, index) =>
                <button 
                    key={index}
                    onClick={() => {
                        const originalIndex = indexMapping[index]
                        checkAnswer([originalIndex], attempted, setAttempted)
                        correct.length > 1 
                        ? selected.includes(originalIndex) 
                            ? setSelected(selected.filter(alternative => alternative !== originalIndex)) 
                            : setSelected([...selected, originalIndex])
                        : setSelected([originalIndex]); setAttempted(prev => [...prev, originalIndex])
                    }}
                    className={`${getColor(index)} rounded-xl text-sm flex flex-rows-auto text-left p-2 mb-2 w-full`}
                >
                    <h1 
                        className="h-full pr-2 text-md grid place-items-center text-bright"
                    >
                        {index + 1}
                    </h1>
                    {answer}
                </button>
            )}
        </div>
    )
}