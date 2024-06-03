'use client'
import { useState, useRef, useEffect } from "react"
import { useCardNavigation } from "@/hooks/cardNavigation"
import Comments from "./comments"
import { getTotalCommentsLength } from "@/utils/comments"
import sendCardVote from "@/utils/vote"
import Link from "next/link"
import { sendMark } from "@/utils/fetchClient"
import Buttons from "../card/buttons"
import Question from "../card/question"
import { useRouter } from "next/navigation"

type CardsProps = {
    id?: string
    current?: number
    course: Course | string
    comments: CardComment[][]
}

export default function Cards({id, current, course, comments}: CardsProps) {
    
    const router = useRouter()
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
    const [shuffledAlternatives, setShuffledAlternatives] = useState<string[]>([])
    const [indexMapping, setIndexMapping] = useState<number[]>([])
    const cards = typeof course === 'object' ? course.cards as Card[] : []
    const card = cards[current || 0]
    const [wait, setWait] = useState(card?.correct.length > 1 ? true : false)
    selectedRef.current = selected

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
        remainGreen,
        indexMapping
    })

    const flashColor = animate === "wrong" 
        ? "bg-red-800" 
        : animate === "correct" 
            ? "bg-green-500" 
            : "bg-dark"


    function markCourse() {
        sendMark({courseID: id || "PROG1001", mark: true})
    }

    useEffect(() => {
        if (!card?.alternatives) {
            return
        }

        // Shuffles alternatives and creates map
        const shuffled = [...card.alternatives]
        const mapping = shuffled.map((_, index) => index)
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            ;[mapping[i], mapping[j]] = [mapping[j], mapping[i]]
        }
        
        setShuffledAlternatives(shuffled)
        setIndexMapping(mapping)
    }, [card?.alternatives])

    if (current && current >= cards.length ) {
        router.push(`/course/${id}/1`)
        return
    }

    if (typeof course === 'string') {
        return (
            <div className="w-full h-full grid place-items-center col-span-6">
                <h1 className="text-xl">{course}</h1>
            </div>
        )
    }

    if (!cards.length) {
        return (
            <div className="w-full h-full col-span-6 grid place-items-center">
                <div className="grid place-items-center">
                    <h1 className="text-xl text-center mb-2">Course {course.id} has no content yet.</h1>
                    <Link
                        className="bg-dark rounded-xl px-2 h-[4vh] w-[10vw] grid place-items-center mb-2 bg-orange-500"
                        href={`/edit/${course.id}`}
                    >
                        Edit course
                    </Link>
                    <h1 className="text-xl text-center mb-2">Mark course as learning based (no multiple choice)</h1>
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
                <h1 className="text-xl">Course {course.id} completed ({length} {length > 1 ? 'cards' : 'card'}).</h1>
            </div>
        )
    }

    if (!card) {
        router.push(`/course/${id}/1`)
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
        <div className="w-full h-full max-h-full grid grid-rows-10 gap-8 col-span-6 overflow-hidden">
            <Question
                card={card} 
                cards={cards} 
                current={current} 
                selected={selected} 
                animateAnswer={animateAnswer} 
                attempted={attempted} 
                remainGreen={remainGreen}
                wait={wait}
                clientVote={clientVote}
                showComments={showComments}
                totalCommentsLength={totalCommentsLength}
                indexMapping={indexMapping}
                shuffledAlternatives={shuffledAlternatives}
                checkAnswer={checkAnswer} 
                handleVote={handleVote}
                setSelected={setSelected} 
                setAttempted={setAttempted} 
                setRemainGreen={setRemainGreen}
                setShowComments={setShowComments}
                showAnswers={showAnswers}
            />
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
