'use client'
import shuffle from "@utils/shuffle"
import { useEffect, useState, useRef } from "react"
import getCourseByID from "@utils/getCourseByID"
import { useRouter } from "next/navigation"

type AlternativesProps = {
    alternatives: string[]
    selected: number
    animateAnswer: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
    checkAnswer: (input: number) => void
}

type animate200msProps = {
    key: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
}

type FlashCardsProps = {
    id?: string
    current?: number
}

export default function Flashcards({id, current}: FlashCardsProps) {
    const router = useRouter();
    const [animate, setAnimate] = useState("-1")
    const [animateAnswer, setAnimateAnswer] = useState("-1")
    const [selected, setSelected] = useState(-1)
    const selectedRef = useRef(selected)
    selectedRef.current = selected
    const course = getCourseByID(id || "PROG1001")
    const flashcards = course.flashcards
    const flashcard = flashcards[current || 0]
    const button = `text-2xl rounded-xl grid place-items-center`
    const flashColor = animate === "wrong" 
        ? "bg-red-800" 
        : animate === "correct" 
            ? "bg-green-500" 
            : "bg-gray-800"

    function handleNavigation(direction: string) {

        switch (direction) {
            case 'back': 
                if (current != undefined) {
                    const previous = current === 0 ? 0 : current - 1
                    router.push(`/course/${id}/${previous}`)
                }

                animate200ms({key: 'back', setAnimateAnswer})
                setSelected(-1)
                break
            case 'skip': 
                if (current != undefined) {
                    const skip = (current + 1) % flashcards.length
                    router.push(`/course/${id}/${skip}`)
                } else console.log('no current')

                animate200ms({key: 'skip', setAnimateAnswer})
                setSelected(-1)
                break
            case 'next':
                checkAnswer(selectedRef.current)
                animate200ms({key: 'next', setAnimateAnswer})
                setSelected(-1)
                break
            case '1': 
                animate200ms({key: '0', setAnimateAnswer})
                checkAnswer(0)
                setSelected(-1)
                break
            case '2': 
                animate200ms({key: '1', setAnimateAnswer})
                checkAnswer(1)
                setSelected(-1)
                break
            case '3':
                animate200ms({key: '2', setAnimateAnswer})
                checkAnswer(2)
                setSelected(-1)
                break
            case '4': 
                animate200ms({key: '3', setAnimateAnswer})
                checkAnswer(3)
                setSelected(-1)
                break
            case 'up': 
                setSelected((prev) => (prev === flashcard.alternatives.length - 1 ? 0 : prev + 1))
                break
            case 'down': 
                setSelected((prev) => (prev === 0 ? flashcard.alternatives.length - 1 : prev - 1 >= 0 ? prev - 1 : flashcard.alternatives.length - 1))
                break
        }
    }

    function checkAnswer(input: number) {
        if (input === flashcard.correct) {
            if (current != undefined) {
                const next = current + 1 < flashcards.length ? current + 1 : -1
                router.push(`/course/${id}/${next}`)
            }
            setAnimate("correct")
            setTimeout(() => setAnimate("-1"), 200)
        } else {
            setAnimate("wrong")
            setTimeout(() => setAnimate("-1"), 200)
        }
    }

    useEffect(() => {
        function handleKeyDown(event: any) {
            switch (event.key) {
                case 'd':
                case 'D':
                case 'ArrowRight': handleNavigation('next'); break
                case 'a':
                case 'A':
                case 'b':
                case 'B':
                case 'ArrowLeft': handleNavigation('back'); break
                case 's': 
                case 'S': handleNavigation('skip'); break
                case '1': handleNavigation("1"); break
                case '2': handleNavigation("2"); break
                case '3': handleNavigation("3"); break
                case '4': handleNavigation("4"); break
                case 'Enter': handleNavigation('next'); break
                case 'ArrowUp': handleNavigation('up'); break
                case 'ArrowDown': handleNavigation('down'); break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    if (!flashcards.length) {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-3xl">Course {course.id} has no content yet.</h1>
            </div>
        )
    }

    if (!flashcard) {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-3xl">Course {course.id} only has {course.flashcards.length} questions. You tried to access Q{current}.</h1>
            </div>
        )
    }

    return (
        <div className="w-full h-full grid grid-rows-10 col-span-6 gap-8">
            <div className={`w-full h-full rounded-xl bg-gray-800 p-8 row-span-9 pb-8`}>
                <div className="w-full grid grid-cols-2">
                    <h1 className="text-4xl mb-8">{flashcard.question}</h1>
                    <h1 className="text-right text-gray-500">{(current || 0) + 1} / {flashcards.length}</h1>
                </div>
                <Alternatives 
                    alternatives={flashcard.alternatives}
                    selected={selected}
                    animateAnswer={animateAnswer} 
                    setAnimateAnswer={setAnimateAnswer} 
                    checkAnswer={checkAnswer}
                />
            </div>
            <div className="w-full h-full rounded-xl grid grid-cols-3 gap-8">
                <button 
                    className={`${button} ${animateAnswer === 'back' ? "bg-gray-700" : "bg-gray-800"}`}
                    onClick={() => handleNavigation('back')}
                >
                    back
                </button>
                <button 
                    className={`${button} ${animateAnswer === 'skip' ? "bg-gray-700" : "bg-gray-800"}`}
                    onClick={() => handleNavigation('skip')}
                >
                    skip
                </button>
                <button 
                    className={`${button} ${flashColor}`}
                    onClick={() => handleNavigation('next')}
                >
                    next
                </button>
            </div>
        </div>
    )
}

function Alternatives({alternatives, selected, animateAnswer, setAnimateAnswer, checkAnswer}: AlternativesProps) {
    // const answers  = shuffle(alternatives)

    return (
        <div className='grid grid-rows-auto w-full gap-4'>
            {alternatives.map((answer, index) =>
                <div key={index} className="grid grid-cols-10 h-[6vh]">
                    <h1 className="text-2xl grid place-items-center">{index + 1}</h1>
                    <button 
                        onClick={() => {
                            animate200ms({key: index.toString(), setAnimateAnswer})
                            checkAnswer(index)
                        }}
                        className={`${Number(animateAnswer) === index ? "bg-orange-500" : selected === index ? "bg-gray-400" : "bg-gray-700"} rounded-xl text-2xl col-span-9`}>
                        {answer}
                    </button>
                </div>
            )}
        </div>
    )
}

function animate200ms({key, setAnimateAnswer}: animate200msProps) {
    setAnimateAnswer(key)
    setTimeout(() => setAnimateAnswer("-1"), 200)
}
