'use client'
import shuffle from "@utils/shuffle"
import { useState, useRef, SetStateAction, Dispatch, useEffect, use } from "react"
import { useCardNavigation } from "@/hooks/cardNavigation"
import Comments from "./comments"
import { getTotalCommentsLength } from "@/utils/comments"
import Image from "next/image"
import sendCardVote from "@/utils/vote"
import Link from "next/link"
import { sendMark } from "@/utils/fetchClient"
import { Markdown } from "../editor/editor"
import { usePathname } from "next/navigation"
import Study from "./study"

type AlternativesProps = {
    alternatives: string[]
    selected: number[]
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
    animateAnswer: string
    checkAnswer: (input: number[], attempted: number[], setAttempted: Dispatch<SetStateAction<number[]>>) => void
    attempted: number[]
    setAttempted: React.Dispatch<React.SetStateAction<number[]>>
    correct: number[]
    remainGreen: number[]
    setRemainGreen: React.Dispatch<React.SetStateAction<number[]>>
    wait: boolean
}

type CardsProps = {
    id?: string
    current?: number
    course: Course | string
    comments: CardComment[][]
}

type ButtonsProps = {
    animateAnswer: string
    navigate: (direction: string) => void
    flashColor: string
}

export default function Cards({id, current, course, comments}: CardsProps) {
    const [animate, setAnimate] = useState("-1")
    const [animateAnswer, setAnimateAnswer] = useState("-1")
    const [selected, setSelected] = useState<number[]>([-1])
    const [clientVote, setClientVote] = useState<1 | 0 | -1>(0)
    const [showComments, setShowComments] = useState(false)
    const [attempted, setAttempted] = useState<number[]>([])
    const selectedRef = useRef(selected)
    const relevantComments = comments[Number(id) || 0] || []
    const [remainGreen, setRemainGreen] = useState<number[]>([])
    const totalCommentsLength = getTotalCommentsLength(relevantComments, current || 0)   
    selectedRef.current = selected
    
    const cards = typeof course === 'object' ? course.cards as Card[] : []
    const card = cards[current || 0]
    const [wait, setWait] = useState(card?.correct.length > 1 ? true : false)
    const flashColor = animate === "wrong" 
        ? "bg-red-800" 
        : animate === "correct" 
            ? "bg-green-500" 
            : "bg-dark"

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
        setAttempted,
        wait,
        setWait,
        remainGreen
    })

    function markCourse() {
        sendMark({courseID: id || "PROG1001", mark: true})
    }

    if (typeof course === 'string') {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-2xl">{course}</h1>
            </div>
        )
    }

    if (!cards.length) {
        return (
            <div className="w-full h-full col-span-6 grid place-items-center">
                <div className="grid place-items-center">
                    <h1 className="text-2xl text-center mb-2">Course {course.id} has no content yet.</h1>
                    <Link
                        className="bg-dark rounded-xl px-2 h-[4vh] w-[10vw] grid place-items-center mb-2 bg-orange-500"
                        href={`/edit/${course.id}`}
                    >
                        Edit course
                    </Link>
                    <h1 className="text-2xl text-center mb-2">Mark course as learning based (no multiple choice)</h1>
                    <button 
                        className="bg-orange-500 rounded-xl px-2 h-[4vh] w-[10vw]"
                        onClick={markCourse}
                    >
                        Mark
                    </button>
                </div>
            </div>
        )
    }

    if (current === -1) {
        const length = cards.length

        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-2xl">Course {course.id} completed ({length} {length > 1 ? 'cards' : 'card'}).</h1>
            </div>
        )
    }

    if (!card) {
        window.location.href = `/course/${id}/0`
    }

    const alternativeLength = card.alternatives.reduce((acc, curr) => acc + curr.length, 0)
    const questionLength = card.question.length
    
    function maxHeight(questionLength: number, alternativeLength: number) {
        const table = [
            { condition: (q: number, a: number) => q > 500 && a > 1200, height: "max-h-[10vh]" },
            { condition: (q: number, a: number) => q > 500 && a > 800, height: "max-h-[14vh]" },
            { condition: (q: number, a: number) => q > 500 && a > 400, height: "max-h-[16vh]" },
            { condition: (q: number, _a: number) => q > 500, height: "max-h-[32vh]" },
            { condition: (_q: number, _a: number) => true, height: "max-h-[45vh]" }
        ]
    
        for (let entry of table) {
            if (entry.condition(questionLength, alternativeLength)) {
                return entry.height
            }
        }
    }

    function handleVote(vote: boolean) {
        if (!id) {
            return
        }

        if (clientVote === 1 && vote || clientVote === -1 && !vote) {
            setClientVote(0)
        } else {
            setClientVote(vote ? 1 : -1)
        }

        sendCardVote({courseID: id, cardID: current || 0, vote})
    }

    function showAnswers() {
        setAttempted([...card.correct])
        setRemainGreen([...card.correct])
    }

    return (
        <div className="w-full h-full grid grid-rows-10 gap-8">
            <div className={`w-full h-full row-span-9 bg-dark rounded-xl p-8`}>
                <div className="w-full h-full row-span-9 pb-8">
                    <div className="w-full">
                        <h1 className="text-right text-gray-500 float-right">{card.source} {(current || 0) + 1} / {cards.length}</h1>
                        <div className={`text-md mb-8 ${maxHeight(questionLength, alternativeLength)} overflow-auto`}>
                        {card.correct.length > 1 && <h1 className="text-bright">Multiple choice - Select all correct answers</h1>}
                        {card.theme && <h1 className="text-lg text-gray-500">{card.theme}</h1>}
                        <Markdown
                            displayEditor={false} 
                            handleDisplayEditor={() => {}} 
                            markdown={card.question} 
                        />
                        </div>
                    </div>
                    <Alternatives 
                        alternatives={card.alternatives}
                        selected={selected}
                        setSelected={setSelected}
                        animateAnswer={animateAnswer} 
                        checkAnswer={checkAnswer}
                        attempted={attempted}
                        setAttempted={setAttempted}
                        correct={card.correct}
                        remainGreen={remainGreen}
                        setRemainGreen={setRemainGreen}
                        wait={wait}
                    />
                </div>
                <div className="grid grid-cols-3">
                    <div className="flex flex-rows space-x-2 mb-4">
                        <h1 className="text-bright">{card.rating + clientVote > 0 ? '+' : ''}{card.rating + clientVote}</h1>
                        <button onClick={() => handleVote(true)}>
                            <Image src="/images/thumbsup.svg" alt="logo" height={20} width={20} />
                        </button>
                        <button onClick={() => handleVote(false)}>
                            <Image src="/images/thumbsdown.svg" alt="logo" height={20} width={20} />
                        </button>
                    </div>
                    <button 
                        className="pb-4 text-bright" 
                        onClick={() => setShowComments(!showComments)}
                    >
                        {totalCommentsLength ? `View comments (${totalCommentsLength})` : "Add comment"} {showComments ? '▼' : '▲'}
                    </button>
                    {(wait || !(card.correct.length > 1)) && !remainGreen.every(answer => card.correct.includes(answer)) && <div>
                        <button className="w-full text-end text-bright" onClick={showAnswers}>{card.correct.length > 1 ? "Show answers" : "Show answer"}</button>
                    </div>}
                </div>
            </div>
            <Buttons
                animateAnswer={animateAnswer}
                navigate={navigate}
                flashColor={flashColor}
            />
            {showComments && id && <Comments 
                courseID={id} 
                cardID={current || 0} 
                comments={relevantComments} 
                totalCommentsLength={totalCommentsLength} 
            />}
        </div>
    )
}

function Buttons({animateAnswer, navigate, flashColor}: ButtonsProps) {
    const button = `text-xl rounded-xl grid place-items-center`

    return (
        <div className="w-full h-full rounded-xl grid grid-cols-3 gap-8">
            <button 
                className={`${button} ${animateAnswer === 'back' ? "bg-light" : "bg-dark"}`}
                onClick={() => navigate('back')}
            >
                back
            </button>
            <button 
                className={`${button} ${animateAnswer === 'skip' ? "bg-light" : "bg-dark"}`}
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

function Alternatives({alternatives, selected, animateAnswer, checkAnswer, attempted, setAttempted, correct, setSelected, remainGreen, setRemainGreen, wait}: AlternativesProps) {
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
                <div key={index} className="grid grid-cols-12 mb-2">
                    <h1 className="text-md grid place-items-center">{index + 1}</h1>
                    <button 
                        onClick={() => {
                            checkAnswer([index], attempted, setAttempted)
                            correct.length > 1 
                                ? selected.includes(index) ? setSelected(selected.filter(alternative => alternative !== index)) : setSelected([...selected, index])
                                : setSelected([index]); setAttempted(prev => [...prev, index])
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