'use client'

import { useState, useRef, useEffect } from 'react'
import { useCardNavigation } from '@parent/src/hooks/cardNavigation'
import Comments from './comments'
import Link from 'next/link'
import { sendMark } from '@parent/src/utils/fetchClient'
import Buttons from '../card/buttons'
import Question from '../card/question'
import { useRouter } from 'next/navigation'
import { getComments, sendCardVote } from '@utils/api'

type CardsProps = {
    id?: string
    current?: number
    course: Course | null
}

export default function Cards({ id, current, course }: CardsProps) {

    const router = useRouter()
    const [animate, setAnimate] = useState('-1')
    const [animateAnswer, setAnimateAnswer] = useState('-1')
    const [selected, setSelected] = useState<number[]>([-1])
    const [clientVote, setClientVote] = useState<1 | 0 | -1>(0)
    const [showComments, setShowComments] = useState(false)
    const [attempted, setAttempted] = useState<number[]>([])
    const selectedRef = useRef(selected)
    const [comments, setComments] = useState<CardComment[]>([])
    const [remainGreen, setRemainGreen] = useState<number[]>([])
    const [shuffledAlternatives, setShuffledAlternatives] = useState<string[]>([])
    const [indexMapping, setIndexMapping] = useState<number[]>([])
    const [cards, setCards] = useState<Card[]>(course !== null ? course.cards : [])
    const card = cards[current || 0]
    const [wait, setWait] = useState(card?.answers.length > 1 ? true : false)
    selectedRef.current = selected

    const { navigate, checkAnswer } = useCardNavigation({
        current,
        id: id || 'PROG1001',
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

    const flashColor = animate === 'wrong'
        ? 'bg-red-800'
        : animate === 'correct'
            ? 'bg-green-500'
            : 'bg-login-900'


    function markCourse() {
        sendMark({ courseId: id || 'PROG1001', learningBased: true })
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

    useEffect(() => {
        if (typeof card?.vote === 'boolean') {
            setClientVote(card.vote ? 1 : -1)
        } else {
            setClientVote(0)
        }
    }, [card])

    useEffect(() => {
        (async() => {
            const response = await getComments(card.id)
            if (Array.isArray(response)) {
                setComments(response)
            }
        })()
    }, [card])

    if (current && current >= cards.length) {
        router.push(`/course/${id}/1`)
        return <></>
    }

    if (!course) {
        return (
            <div className='col-span-6 w-full h-full grid place-items-center'>
                <div className='bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center gap-6 grid place-items-center self-center'>
                    <h1 className='text-xl font-semibold'>Course Unavailable</h1>
                    <h1 className='px-16'>The course is currently unavailable. Please try again later.</h1>
                    <h1 className='text-sm'>Details: {course}</h1>
                </div>
            </div>
        )
    }

    if (!cards.length) {
        return (
            <div className='w-full h-full col-span-6 grid place-items-center'>
                <div className='grid place-items-center'>
                    <h1 className='text-lg text-center mb-2 opacity-80'>
                        Course <span className='font-bold'>{course.code}</span> has no content yet.
                    </h1>
                    <Link
                        className='bg-login-300/10 outline outline-login-300/20 rounded-lg px-2 h-8 w-40 grid place-items-center mb-2 hover:bg-login-300/30'
                        href={`/edit/${course.code}`}
                    >
                        Edit course
                    </Link>
                    <h1 className='text-lg text-center mb-2 opacity-80'>Mark course as learning based (no multiple choice)</h1>
                    <button
                        className={`
                            bg-login/50 hover:bg-login/70 outline h-8 w-40 
                            outline-login/70 rounded-lg px-2 cursor-pointer
                        `}
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
            <div className='w-full h-full grid place-items-center col-span-6'>
                <h1 className='text-xl'>Course {course.code} completed ({length} {length > 1 ? 'cards' : 'card'}).</h1>
            </div>
        )
    }

    if (!card) {
        router.push(`/course/${id}/1`)
        return <></>
    }

    async function handleVote(vote: boolean) {
        if (!id) {
            return
        }

        try {
            const result = await sendCardVote({ cardId: card.id, vote })
            if ('eror' in result) {
                console.error('Failed to send vote:', result.eror)
                return
            }

            const prevVote = clientVote
            setClientVote(vote ? 1 : -1)
            setCards(prev => prev.map(c => c.id === card.id ?
                { ...c, rating: c.rating + (vote ? (prevVote === -1 ? 2 : prevVote === 0 ? 1 : 0)
                    : -(prevVote === 1 ? 2 : prevVote === 0 ? 1 : 0)), vote } : c))
        } catch {
            console.error('Failed to send vote')
        }
    }

    function showAnswers() {
        if (JSON.stringify(remainGreen) === JSON.stringify(card.answers)) {
            setAttempted([])
            setRemainGreen([])
        } else {
            setAttempted([...card.answers])
            setRemainGreen([...card.answers])
        }
    }

    return (
        <div className='w-full h-full flex flex-col gap-2 col-span-6'>
            {id && <Question
                card={card}
                cards={cards}
                comments={comments}
                current={current}
                selected={selected}
                animateAnswer={animateAnswer}
                attempted={attempted}
                remainGreen={remainGreen}
                wait={wait}
                clientVote={clientVote}
                showComments={showComments}
                indexMapping={indexMapping}
                shuffledAlternatives={shuffledAlternatives}
                courseId={id}
                checkAnswer={checkAnswer}
                handleVote={handleVote}
                setSelected={setSelected}
                setAttempted={setAttempted}
                setRemainGreen={setRemainGreen}
                setShowComments={setShowComments}
                showAnswers={showAnswers}
            />}
            {<Buttons
                animateAnswer={animateAnswer}
                navigate={navigate}
                flashColor={flashColor}
            />}
            {showComments && id && <Comments
                courseId={id}
                cardId={card.id}
                comments={comments}
            />}
        </div>
    )
}
