'use client'

import AddCard from '@components/card/addCard'
import Cards from '@components/editor/cards'
import Header from '@components/editor/header'
import { updateCourse } from '@parent/src/utils/fetch'
import { getCourse } from '@utils/api'
import Link from 'next/link'
import { ChangeEvent, useEffect, useRef, useState, use } from 'react'

export default function Edit(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params)
    const courseId = params.id.toUpperCase()
    const [editing, setEditing] = useState<Editing>({ cards: [], notes: '' })
    const [editingIndex, setEditingIndex] = useState(-1)
    const [cards, setCards] = useState<Card[]>([])
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
            const newCourse = await getCourse(courseId)

            if (newCourse && !('error' in newCourse)) {
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
    }, [courseId])

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

    function handleSubmit() {
        updateCourse({ id: courseId, editing })
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
        <div className='w-full h-full rounded-lg gap-2 flex flex-col'>
            <div className='w-full h-full grid grid-cols-4 gap-2 min-h-[87vh]'>
                <div className='w-full h-full bg-login-900 col-span-3 rounded-lg flex flex-col'>
                    <Header
                        clearCard={clearCard}
                        editing={editing}
                        setEditing={setEditing}
                        hideText={hideText}
                    />
                    <div className='w-full h-[68vh] px-2'>
                        <div className={`w-full h-full ${showText ? 'grid grid-cols-2 gap-2' : ''}`}>
                            {showText && <textarea
                                value={editing.notes}
                                onChange={handleTextChange}
                                className='w-full h-full overflow-auto noscroll bg-login-700 rounded-lg p-2 resize-none whitespace-pre-wrap outline-hidden caret-orange-500'
                            />}
                            <AddCard
                                courseId={courseId}
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
            <div className='w-full h-full grid place-items-center'>
                <Link
                    href={'/'}
                    onClick={handleSubmit}
                    className='h-full rounded-lg bg-login px-8 font-bold grid place-items-center'
                >
                    Publish changes
                </Link>
            </div>
        </div>
    )
}
