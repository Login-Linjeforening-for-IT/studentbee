import { Dispatch, SetStateAction } from "react"

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
    function getColor(index: number): string {
        if (remainGreen.includes(index)) {
            return "bg-green-500"
        }

        if (!wait) {
            for (let i = 0; i < attempted.length; i++) {
                if (correct.includes(index) && attempted.includes(index)) {
                    return "bg-green-500"
                }
            }
        }

        if (!wait) {
            if (attempted.includes(index) && !correct.includes(index)) {
                return "bg-red-800"
            }
        }

        if (animateAnswer === index.toString()) {
            if (animateAnswer === correct.toString()) {
                !remainGreen.includes(index) && setRemainGreen([...remainGreen, index])
                return "bg-green-500"
            }
        }

        if (selected.includes(index)) {
            return "bg-extralight"
        }
        
        return "bg-light"
    }

    return (
        <div className='w-full'>
            {alternatives.map((answer, index) =>
                <button 
                    key={index}
                    onClick={() => {
                        checkAnswer([index], attempted, setAttempted)
                        correct.length > 1 
                        ? selected.includes(index) 
                            ? setSelected(selected.filter(alternative => alternative !== index)) 
                            : setSelected([...selected, index])
                        : setSelected([index]); setAttempted(prev => [...prev, index])
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
