'use client'
import shuffle from "@utils/shuffle"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import handleCardsNavigation, { animate200ms, handleKeyDown } from "@utils/navigation"
import { useCardNavigation } from "@/hooks/cardNavigation"
import { getCourse } from "@/utils/fetch"

type AlternativesProps = {
    alternatives: string[]
    selected: number
    animateAnswer: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
    checkAnswer: (input: number) => void
}

type CardsProps = {
    id?: string
    current?: number
}

type ButtonsProps = {
    button: string
    animateAnswer: string
    navigate: (direction: string) => void
    flashColor: string
}

export default function Cards({id, current}: CardsProps) {
    const [animate, setAnimate] = useState("-1")
    const [animateAnswer, setAnimateAnswer] = useState("-1")
    const [selected, setSelected] = useState(-1)
    const selectedRef = useRef(selected)
    selectedRef.current = selected
    const [course, setCourse] = useState<Course | string>("Loading...")

    const cards = typeof course === 'object' ? course.cards as Card[] : []
    const card = cards[current || 0]
    const button = `text-2xl rounded-xl grid place-items-center`
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
    })

    useEffect(() => {
        (async() => {
            const newCourse: Course | string = await getCourse(id || "PROG1001")

            if (typeof course === typeof newCourse || typeof newCourse === 'object') {
                setCourse(newCourse)
            }
        })()
    }, [])

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

    return (
        <div className="w-full h-full grid grid-rows-10 col-span-6 gap-8">
            <div className={`w-full h-full rounded-xl bg-gray-800 p-8 row-span-9 pb-8`}>
                <div className="w-full grid grid-cols-2">
                    <h1 className="text-xl mb-8">{card.question}</h1>
                    <h1 className="text-right text-gray-500">{(current || 0) + 1} / {cards.length}</h1>
                </div>
                <Alternatives 
                    alternatives={card.alternatives}
                    selected={selected}
                    animateAnswer={animateAnswer} 
                    setAnimateAnswer={setAnimateAnswer} 
                    checkAnswer={checkAnswer}
                />
            </div>
            <Buttons 
                button={button} 
                animateAnswer={animateAnswer} 
                navigate={navigate} 
                flashColor={flashColor} 
            />
        </div>
    )
}

function Buttons({button, animateAnswer, navigate, flashColor}: ButtonsProps) {
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

function Alternatives({alternatives, selected, animateAnswer, setAnimateAnswer, checkAnswer}: AlternativesProps) {
    return (
        <div className='w-full'>
            {alternatives.map((answer, index) =>
                <div key={index} className="grid grid-cols-10 mb-2">
                    <h1 className="text-2xl grid place-items-center">{index + 1}</h1>
                    <button 
                        onClick={() => {
                            animate200ms({key: index.toString(), setAnimateAnswer})
                            checkAnswer(index)
                        }}
                        className={`${Number(animateAnswer) === index ? "bg-orange-500" : selected === index ? "bg-gray-400" : "bg-gray-700"} rounded-xl text-lg col-span-9 text-left pl-2`}>
                        {answer}
                    </button>
                </div>
            )}
        </div>
    )
}