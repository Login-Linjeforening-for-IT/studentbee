'use client'

import useClearStateAfter from '@/hooks/useClearStateAfter'
import AddCard from '@components/card/addCard'
import Cards from '@components/editor/cards'
import Header from '@components/editor/header'
import { getCookie } from '@utils/cookies'
import { getCourse } from '@parent/src/utils/fetch'
import { updateCourse } from '@utils/fetchClient'
import { X } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

export default function PageClient({ code, id }: { code: string, id: string }) {
    const [courseCode, setCourseCode] = useState(code)
    const [editing, setEditing] = useState<Editing>({ cards: [], notes: '' })
    const [editingIndex, setEditingIndex] = useState(-1)
    const [cards, setCards] = useState<Card[]>([])
    const [error, setError] = useState<string>('')
    const { condition: message, setCondition: setMessage } = useClearStateAfter()
    const [showText, setShowText] = useState(true)
    const [alternativeIndex, setAlternativeIndex] = useState(0)
    const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])
    const emptyCard: Card = {
        id: 0,
        courseId: 0,
        question: '',
        alternatives: [''],
        answers: [],
        source: '',
        help: '',
        theme: '',
        rating: 0,
        votes: [],
        createdBy: '',
        createdAt: '',
        updatedAt: ''
    }
    const [card, setCard] = useState<Card>(emptyCard)

    useEffect(() => {
        (async () => {
            const token = getCookie('access_token') || ''
            const newCourse = await getCourse('client', id, token)

            if (newCourse && !('error' in newCourse)) {
                setCourseCode(newCourse.courseCode)
                if (!editing.cards.length) {
                    if (!cards.length) {
                        setCards(newCourse.cards)
                    }

                    setEditing({
                        notes: newCourse.notes,
                        cards: newCourse.cards,
                    } as Editing)
                }
            }
        })()
    }, [])

    useEffect(() => {
        editing.cards.forEach((card, cardIndex) => {
            card.alternatives.forEach((_, index) => {
                const ref = textareaRefs.current[cardIndex * card.alternatives.length + index]
                if (ref) {
                    autoResizeTextarea(ref)
                }
            })
        })
    }, [editing.cards])

    async function handleSubmit() {
        const response = await updateCourse({ id, editing })
        try {
            let data = response
            if (!Object.keys(data).length) {
                data = JSON.parse(response)
            }

            if ('error' in data) {
                return setError(data.error)
            } else if ('id' in data) {
                return setMessage('Updated course.')
            } else {
                return setError(response)
            }
        } catch (error) {
            console.log('error', error)
            return setError(response)
        }
    }

    function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setEditing({ ...editing, notes: event.target.value })
    }

    function addCard() {
        if (!card.question) {
            return
        }

        if (editingIndex !== -1) {
            const tempCards = [...cards]
            tempCards[editingIndex] = card
            tempCards[editingIndex].alternatives = card.alternatives.filter((alternative) => alternative.length)
            setCards(tempCards)
            setCard(emptyCard)
            setEditingIndex(-1)
            return
        }

        setAlternativeIndex(0)
        setCards([...cards, {
            ...card,
            alternatives: card.alternatives.filter((alternative) => alternative.length)
        }])
        setCard({ ...emptyCard, source: card.source })
        setEditing({ ...editing, cards })
    }

    function handleClick(index: number) {
        setCard(cards[index])
        setAlternativeIndex(cards[index].alternatives.length - 1)
        setEditingIndex(index)
    }

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    function clearCard() {
        setCard(emptyCard)
        setAlternativeIndex(0)
        setEditingIndex(-1)
    }

    function hideText() {
        setShowText(!showText)
    }

    return (
        <div className='w-full h-full rounded-lg gap-2 flex flex-col mt-6'>
            <div className='w-full grid grid-cols-4 gap-2'>
                <div className='w-full h-full bg-login-900 col-span-3 rounded-lg flex flex-col'>
                    <Header
                        code={courseCode}
                        clearCard={clearCard}
                        editing={editing}
                        setEditing={setEditing}
                        hideText={hideText}
                    />
                    <div className='w-full h-full px-2'>
                        <div className={`w-full h-full ${showText ? 'grid grid-cols-2 gap-2' : ''}`}>
                            {showText && <textarea
                                value={editing.notes}
                                onChange={handleTextChange}
                                className='w-full h-full overflow-auto noscroll bg-login-700 rounded-lg p-2 resize-none whitespace-pre-wrap outline-hidden caret-orange-500'
                            />}
                            <AddCard
                                courseId={id}
                                card={card}
                                setCard={setCard}
                                addCard={addCard}
                                alternativeIndex={alternativeIndex}
                                setAlternativeIndex={setAlternativeIndex}
                            />
                        </div>
                    </div>
                </div>
                <Cards
                    card={card}
                    cards={cards}
                    setCards={setCards}
                    handleClick={handleClick}
                />
            </div>
            {(error || message) && <div
                onClick={() => setError('')}
                className={`
                    absolute ${message && 'top-17.5 right-5'}
                    ${error && 'bg-login-700/50 grid top-0 left-0 place-items-center w-full h-full'}
                `}>
                {error ? <div className={`
                        w-md grid place-items-center bg-login-100/10 outline
                        outline-login-100/20 backdrop-blur-md shadow-lg
                        rounded-lg h-30 relative'
                    `}>
                    <div
                        onClick={(e) => {e.preventDefault(); setError('')}}
                        className={`
                            absolute top-2 right-2 rounded-lg
                            hover:bg-login-300/10 w-8 h-8 grid
                            place-items-center cursor-pointer
                        `}>
                        <X className='w-4 h-4' />
                    </div>
                    <h1 className='font-semibold'>Failed to update course</h1>
                    <h1>Details: {typeof error === 'string' ? error : JSON.stringify(error)}</h1>
                </div> : <div className={`
                    w-xs grid place-items-center bg-green-500/10 outline
                    outline-green-500/20 backdrop-blur-md shadow-lg
                    rounded-lg h-10 relative'
                `}>
                    <h1 className='font-semibold'>{message}</h1>
                </div>}
            </div>}
            <div className='w-full h-8 grid place-items-center'>
                <button
                    onClick={handleSubmit}
                    className='h-8 rounded-lg bg-login px-8 font-bold grid place-items-center cursor-pointer'
                >
                    Publish changes
                </button>
            </div>
        </div>
    )
}
