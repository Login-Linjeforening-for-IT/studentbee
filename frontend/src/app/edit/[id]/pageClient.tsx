'use client'

import useClearStateAfter from '@/hooks/useClearStateAfter'
import AddCard from '@components/card/addCard'
import Cards from '@components/editor/cards'
import Header from '@components/editor/header'
import { getCookie } from 'utilbee'
import { getCourse } from '@parent/src/utils/fetch'
import { deleteCourse, updateCourse } from '@utils/api'
import { X } from 'lucide-react'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type DeleteCourseProps = {
    display: boolean
    setDisplay: Dispatch<SetStateAction<boolean>>
    course: Course
    handleDelete: () => void
}

export default function PageClient({ course, id }: { course: Course, id: string }) {
    const [code, setCode] = useState(course.code)
    const [editing, setEditing] = useState<Course>({ ...course })
    const [savedCourse, setSavedCourse] = useState<Course>({ ...course })
    const [editingIndex, setEditingIndex] = useState(-1)
    const [displayDelete, setDisplayDelete] = useState(false)
    const [error, setError] = useState<string>('')
    const { condition: message, setCondition: setMessage } = useClearStateAfter()
    const [showText, setShowText] = useState(true)
    const [onlyNotes, setOnlyNotes] = useState(false)
    const [alternativeIndex, setAlternativeIndex] = useState(0)
    const router = useRouter()
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
        vote: null,
        createdBy: '',
        createdAt: '',
        updatedAt: ''
    }
    const [card, setCard] = useState<Card>(emptyCard)

    const isSaveDisabled = JSON.stringify(editing) === JSON.stringify(savedCourse)

    useEffect(() => {
        (async () => {
            const token = getCookie('access_token') || ''
            const newCourse = await getCourse('client', id, token)

            if (typeof newCourse !== 'string') {
                setCode(newCourse.code)
                if (!editing.cards.length && newCourse.cards.length) {
                    setEditing({ ...newCourse })
                }
                setSavedCourse({ ...newCourse })
            }
        })()
    }, [])

    useEffect(() => {
        setSavedCourse({ ...course })
    }, [course])

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

    async function handleDelete() {
        const response = await deleteCourse({ id: course.id })

        if ('error' in response) {
            setError(response.error)
        } else if ('message' in response) {
            setMessage('Deleted course.')
        } else {
            setError('Unknown error')
        }

        setTimeout(() => {
            router.push('/edit')
        }, 1500)
    }

    async function handleSubmit() {
        const response = await updateCourse({ course: editing })

        if ('error' in response) {
            setError(response.error)
        } else if ('id' in response) {
            setMessage('Updated course.')
            setSavedCourse({ ...editing })
        } else {
            setError('Unknown error')
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
            const tempCards = [...editing.cards]
            tempCards[editingIndex] = card
            tempCards[editingIndex].alternatives = card.alternatives.filter((alternative) => alternative.length)
            setEditing((prev) => ({ ...prev, cards: tempCards }))
            setCard(emptyCard)
            setEditingIndex(-1)
            return
        }

        setAlternativeIndex(0)
        setEditing(prev => ({
            ...prev, cards: [...prev.cards, {
                ...card,
                alternatives: card.alternatives.filter((alternative) => alternative.length)
            }]
        }))
        setCard({ ...emptyCard, source: card.source })
    }

    function handleClick(index: number) {
        if (editingIndex === index) {
            clearCard()
            return
        }

        setCard(editing.cards[index])
        setAlternativeIndex(editing.cards[index].alternatives.length)
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
        if (onlyNotes) {
            setOnlyNotes(false)
        }
    }

    function toggleOnlyNotes() {
        if (!onlyNotes) {
            setShowText(true)
        }
        setOnlyNotes(!onlyNotes)
    }

    return (
        <div className='w-full h-[calc(100%-1.2rem)] flex flex-col gap-2 mt-4 overflow-hidden'>
            <Header
                code={code}
                clearCard={clearCard}
                editing={editing}
                setEditing={setEditing}
                hideText={hideText}
                handlePublish={handleSubmit}
                handleDelete={() => setDisplayDelete(true)}
                toggleOnlyNotes={toggleOnlyNotes}
                onlyNotes={onlyNotes}
                cardCount={editing.cards.length}
                publishDisabled={isSaveDisabled}
            />

            <div className='flex-1 grid grid-cols-10 gap-2 overflow-hidden'>
                {showText && (
                    <div className={`${onlyNotes ? 'col-span-10' : 'col-span-3'} bg-login-900 rounded-lg p-4 flex flex-col h-full`}>
                        <h1 className='text-sm text-login-300 mb-4 uppercase tracking-wider font-semibold'>Notes</h1>
                        <textarea
                            value={editing.notes}
                            onChange={handleTextChange}
                            className='w-full flex-1 overflow-auto noscroll bg-login-800 rounded-lg p-3 resize-none whitespace-pre-wrap outline-hidden caret-login text-login-100 text-sm leading-relaxed'
                            placeholder='Add notes here...'
                        />
                    </div>
                )}

                {!onlyNotes && (
                    <>
                        <div className={`${showText ? 'col-span-5' : 'col-span-8'} bg-login-900 rounded-lg p-4 flex flex-col h-full overflow-hidden`}>
                            <h1 className='text-sm text-login-300 mb-4 uppercase tracking-wider font-semibold'>Card Editor</h1>
                            <AddCard
                                courseId={id}
                                card={card}
                                setCard={setCard}
                                addCard={addCard}
                                alternativeIndex={alternativeIndex}
                                setAlternativeIndex={setAlternativeIndex}
                                isEditing={editingIndex !== -1}
                                isSaved={editingIndex !== -1 && JSON.stringify(card) === JSON.stringify(editing.cards[editingIndex])}
                                isEmpty={JSON.stringify(card) === JSON.stringify(emptyCard)}
                            />
                        </div>

                        <div className='col-span-2 h-full overflow-hidden'>
                            <Cards
                                card={card}
                                cards={editing.cards}
                                setEditing={setEditing}
                                handleClick={handleClick}
                            />
                        </div>
                    </>
                )}
            </div>

            {(error || message) && <div
                onClick={() => setError('')}
                className={`
                    absolute ${message && 'bottom-5 right-5'}
                    ${error && 'bg-login-700/50 grid top-0 left-0 place-items-center w-full h-full z-50'}
                `}>
                {error ? <div className={`
                        w-md grid place-items-center bg-login-900 outline
                        outline-login-700 shadow-2xl
                        rounded-lg h-30 relative'
                    `}>
                    <div
                        onClick={(e) => { e.preventDefault(); setError('') }}
                        className={`
                            absolute top-2 right-2 rounded-lg
                            hover:bg-login-800 w-8 h-8 grid
                            place-items-center cursor-pointer
                        `}>
                        <X className='w-4 h-4' />
                    </div>
                    <h1 className='font-semibold text-red-400'>Failed to {displayDelete ? 'delete' : 'update'} course</h1>
                    <h1 className='text-login-200'>Details: {typeof error === 'string' ? error : JSON.stringify(error)}</h1>
                </div> : <div className={`
                    w-xs grid place-items-center bg-green-500/20 outline
                    outline-green-500/30 backdrop-blur-md shadow-lg
                    rounded-lg h-10 relative'
                `}>
                    <h1 className='font-semibold text-green-400'>{message}</h1>
                </div>}
            </div>}
            <DeleteCourse
                display={displayDelete}
                setDisplay={setDisplayDelete}
                course={course}
                handleDelete={handleDelete}
            />
        </div>
    )
}

function DeleteCourse({ display, setDisplay, course, handleDelete }: DeleteCourseProps) {
    const buttonStyle = `
        rounded-md w-full bg-login-700 outline outline-login-600
        hover:bg-login-600 col-span-2 cursor-pointer text-white py-2 transition-colors
    `
    const buttonStyleRed = `
        rounded-md w-full bg-red-500/20 outline outline-red-500/40
        hover:bg-red-500/30 cursor-pointer text-red-200 py-2 transition-colors
    `
    if (!display) {
        return <></>
    }

    return (
        <div
            onClick={() => setDisplay(false)}
            className={`
                absolute bg-login-900/80 grid top-0 left-0 place-items-center
                w-full h-full z-50 backdrop-blur-sm
            `}>
            <div className={`
                    w-md grid place-items-center bg-login-900 outline
                    outline-login-700 shadow-2xl
                    rounded-lg p-6 relative gap-4
                `}>
                <div
                    onClick={(e) => { e.preventDefault(); setDisplay(false) }}
                    className={`
                        absolute top-2 right-2 rounded-lg
                        hover:bg-login-800 w-8 h-8 grid
                        place-items-center cursor-pointer
                    `}>
                    <X className='w-4 h-4 text-login-300' />
                </div>
                <h1 className='font-bold text-xl text-white'>Delete course {course.code}</h1>
                <p className='text-login-300 text-center'>Are you sure you want to delete course {course.code}, including all related cards and comments?</p>
                <div className='w-full rounded-lg gap-3 grid grid-cols-3 items-center mt-2'>
                    <button className={buttonStyle} onClick={() => setDisplay(false)}>Cancel</button>
                    <button className={buttonStyleRed} onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}
