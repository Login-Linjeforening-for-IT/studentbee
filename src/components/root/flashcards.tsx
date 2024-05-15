'use client'
import shuffle from "@/utils/shuffle"
import { useEffect, useState } from "react"
import getCourseByID from "@/utils/getCourseByID"
import getCookie from "@/utils/cookies"

type AlternativesProps = {
    alternatives: string[]
    selected: number
    animateAnswer: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
}

type animate200msProps = {
    key: string
    setAnimateAnswer: React.Dispatch<React.SetStateAction<string>>
}

export default function Flashcards({id}: {id?: string}) {
    const [current, setCurrent] = useState(0)
    const [animate, setAnimate] = useState("-1")
    const [animateAnswer, setAnimateAnswer] = useState("-1")
    const [selected, setSelected] = useState(-1)
    const course = getCourseByID(id || "PROG1001")
    const flashcards = course.flashcards
    const flashcard = flashcards[current]
    const button = `text-2xl rounded-xl grid place-items-center`
    const flashColor = animate === "wrong" 
        ? "bg-red-800" 
        : animate === "correct" 
            ? "bg-green-500" 
            : "bg-gray-800"

    // Function to handle navigation
    function handleNavigation(direction: string) {
        switch (direction) {
            case 'back': 
                setCurrent((prev) => (prev === 0 ? 0 : prev - 1))
                animate200ms({key: 'back', setAnimateAnswer})
                setSelected(-1)
                break
            case 'skip': 
                setCurrent((prev) => (prev + 1) % flashcards.length)
                animate200ms({key: 'skip', setAnimateAnswer})
                setSelected(-1)
                break
            case 'next':
                animate200ms({key: 'next', setAnimateAnswer})
                setSelected(-1)
                checkAnswer()
                break
            case '1': 
                animate200ms({key: '0', setAnimateAnswer}); 
                setSelected(0)
                checkAnswer()
                break
            case '2': 
                animate200ms({key: '1', setAnimateAnswer}); 
                setSelected(1)
                checkAnswer()
                break
            case '3':
                animate200ms({key: '2', setAnimateAnswer}); 
                setSelected(2)
                checkAnswer()
                break
            case '4': 
                animate200ms({key: '3', setAnimateAnswer}); 
                setSelected(3)
                checkAnswer()
                break
            case 'up': changeSelected('up'); break
            case 'down': changeSelected('down'); break
        }
    }

    function changeSelected(direction: 'up' | 'down') {
        if (direction === 'up') {
            setSelected((prev) => (prev === 0 || prev === -1 ? flashcard.alternatives.length - 1 : prev - 1))
        } else {
            setSelected((prev) => (prev === flashcard.alternatives.length - 1 ? 0 : prev + 1))
        }
    }

    function checkAnswer() {
        console.log(selected, flashcard.correct)
        if (selected === flashcard.correct) {
            setAnimate("correct")
            setTimeout(() => setAnimate("-1"), 200)
            setCurrent((prev) => (prev + 2) % flashcards.length)
        } else {
            setAnimate("wrong")
            setTimeout(() => setAnimate("-1"), 200)
        }
    }

    // Listen for arrow key presses
    useEffect(() => {
        function handleKeyDown(event: any) {
            console.log(event.key)
            switch (event.key) {
                case 'd':
                case 'D':
                case 'ArrowRight': handleNavigation('next'); break
                case 'a':
                case 'A':
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
        return <div className="w-full h-full grid place-items-center col-span-6"><h1 className="text-3xl">Course {course.id} has no content yet.</h1></div>
    }

    return (
        <div className="w-full h-full grid grid-rows-10 col-span-6 gap-8">
            <div className={`w-full h-full ${flashColor} rounded-xl p-8 row-span-9 pb-8`}>
                <h1 className="text-4xl mb-8">{flashcard.question}</h1>
                <Alternatives 
                    alternatives={flashcard.alternatives}
                    selected={selected}
                    animateAnswer={animateAnswer} 
                    setAnimateAnswer={setAnimateAnswer} 
                />
            </div>
            <div className="w-full h-full rounded-xl grid grid-cols-3 gap-8">
                <h1 className={`${button} ${animateAnswer === 'back' ? "bg-gray-700" : "bg-gray-800"}`}>back</h1>
                <h1 className={`${button} ${animateAnswer === 'skip' ? "bg-gray-700" : "bg-gray-800"}`}>skip</h1>
                <h1 className={`${button} ${animateAnswer === 'next' ? "bg-gray-700" : "bg-gray-800"}`}>next</h1>
            </div>
        </div>
    )
}

function Alternatives({alternatives, selected, animateAnswer, setAnimateAnswer}: AlternativesProps) {
    // const answers  = shuffle(alternatives)

    return (
        <div className='grid grid-rows-auto w-full gap-4'>
            {alternatives.map((answer, index) =>
                <div key={index} className="grid grid-cols-10 h-[6vh]">
                    <h1 className="text-2xl grid place-items-center">{index + 1}</h1>
                    <button 
                        onClick={() => animate200ms({key: index.toString(), setAnimateAnswer})}
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