'use client'
import shuffle from "@utils/shuffle"
import { useState, useRef, SetStateAction, Dispatch } from "react"
import { animate200ms } from "@utils/navigation"
import { useCardNavigation } from "@/hooks/cardNavigation"

type AlternativesProps = {
    alternatives: string[]
    selected: number
    animateAnswer: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
    checkAnswer: (input: number, attempted: number[], setAttempted: Dispatch<SetStateAction<number[]>>) => void
    attempted: number[]
    setAttempted: React.Dispatch<React.SetStateAction<number[]>>
}

type CardsProps = {
    id?: string
    current?: number
    course: Course | string
}

type ButtonsProps = {
    animateAnswer: string
    navigate: (direction: string) => void
    flashColor: string
}

export default function Cards({id, current, course}: CardsProps) {
    const [animate, setAnimate] = useState("-1")
    const [animateAnswer, setAnimateAnswer] = useState("-1")
    const [selected, setSelected] = useState(-1)
    const [attempted, setAttempted] = useState<number[]>([])
    const selectedRef = useRef(selected)
    selectedRef.current = selected

    const cards = typeof course === 'object' ? course.cards as Card[] : []
    const card = cards[current || 0]
    const flashColor = animate === "wrong" 
        ? "bg-red-800" 
        : animate === "correct" 
            ? "bg-green-500" 
            : "bg-gray-800"

    const { navigate, checkAnswer } = useCardNavigation({
        current,
        id: id || "PROG1001",
        card,
        cards,
        setAnimate,
        setAnimateAnswer,
        setSelected,
        selectedRef,
        attempted,
        setAttempted
    })

    if (typeof course === 'string') {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-2xl">{course}</h1>
            </div>
        )
    }

    if (!cards.length) {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-2xl">Course {course.id} has no content yet.</h1>
            </div>
        )
    }

    if (current === -1) {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-2xl">Course {course.id} completed ({course.cards.length} cards).</h1>
            </div>
        )
    }

    if (!card) {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-2xl">Course {course.id} only has {course.cards.length} questions. You tried to access Q{current}.</h1>
            </div>
        )
    }

    const alternativeLength = card.alternatives.reduce((acc, curr) => acc + curr.length, 0)
    const questionLength = card.question.length
    
    function maxHeight(questionLength: number, alternativeLength: number) {
        const table = [
            { condition: (q: number, a: number) => q > 500 && a > 1200, height: "max-h-[18vh]" },
            { condition: (q: number, a: number) => q > 500 && a > 800, height: "max-h-[22vh]" },
            { condition: (q: number, a: number) => q > 500 && a > 400, height: "max-h-[26vh]" },
            { condition: (q: number, _a: number) => q > 500, height: "max-h-[34vh]" },
            { condition: (_q: number, _a: number) => true, height: "max-h-[45vh]" }
        ]
    
        for (let entry of table) {
            if (entry.condition(questionLength, alternativeLength)) {
                return entry.height
            }
        }
    }

    return (
        <div className="w-full h-full grid grid-rows-10 col-span-6 gap-8">
            <div className={`w-full h-full rounded-xl bg-gray-800 p-8 row-span-9 pb-8`}>
                <div className="w-full grid grid-cols-12">
                    <h1 className={`text-md mb-8 ${maxHeight(questionLength, alternativeLength)} overflow-auto col-span-11`}>
                    {card.question.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}    
                    </h1>
                    <h1 className="text-right text-gray-500">{(current || 0) + 1} / {cards.length}</h1>
                </div>
                <Alternatives 
                    alternatives={card.alternatives}
                    selected={selected}
                    animateAnswer={animateAnswer} 
                    setAnimateAnswer={setAnimateAnswer} 
                    checkAnswer={checkAnswer}
                    attempted={attempted}
                    setAttempted={setAttempted}
                />
            </div>
            <Buttons 
                animateAnswer={animateAnswer} 
                navigate={navigate} 
                flashColor={flashColor} 
            />
        </div>
    )
}

function Buttons({animateAnswer, navigate, flashColor}: ButtonsProps) {
    const button = `text-xl rounded-xl grid place-items-center`

    return (
        <div className="w-full h-full rounded-xl grid grid-cols-3 gap-8">
            <button 
                className={`${button} ${animateAnswer === 'back' ? "bg-gray-700" : "bg-gray-800"}`}
                onClick={() => navigate('back')}
            >
                back
            </button>
            <button 
                className={`${button} ${animateAnswer === 'skip' ? "bg-gray-700" : "bg-gray-800"}`}
                onClick={() => navigate('skip')}
            >
                skip
            </button>
            <button 
                className={`${button} ${flashColor}`}
                onClick={() => navigate('next')}
            >
                next
            </button>
        </div>
    )
}

function Alternatives({alternatives, selected, animateAnswer, setAnimateAnswer, checkAnswer, attempted, setAttempted}: AlternativesProps) {
    function getColor(index: number): string {
        if (attempted.includes(index)) {
            return "bg-red-800"
        }

        if (animateAnswer === index.toString()) {
            return "bg-orange-500"
        }

        if (selected === index) {
            return "bg-gray-400"
        }
        
        return "bg-gray-700"
    }

    return (
        <div className='w-full'>
            {alternatives.map((answer, index) =>
                <div key={index} className="grid grid-cols-12 mb-2">
                    <h1 className="text-md grid place-items-center">{index + 1}</h1>
                    <button 
                        onClick={() => {
                            animate200ms({key: index.toString(), setAnimateAnswer})
                            checkAnswer(index, attempted, setAttempted)
                        }}
                        className={`${getColor(index)} rounded-xl text-sm col-span-11 text-left p-2`}
                    >
                        {answer}
                    </button>
                </div>
            )}
        </div>
    )
}