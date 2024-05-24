'use client'

import { getCourse, updateCourse } from "@/utils/fetch"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

type AddCardProps = {
    courseID: string
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    addCard: () => void
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

type AlternativeProps = {
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

type AcceptedProps = {
    accepted: Card[]
    setAccepted: Dispatch<SetStateAction<Card[]>>
    handleAcceptedIndexClick: (index: number) => void
}

type RejectedProps = {
    selected: 'cards' | 'text'
    rejected: Card[]
    handleRejectedIndexClick: (index: number) => void
}

type EditCardsProps = {
    editing: Editing
    textareaRefs: React.MutableRefObject<(HTMLTextAreaElement | null)[]>
    handleQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number) => void
    setCorrectAnswer: (index: number, cardIndex: number) => void
    handleAlternativeChange: (event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number, alternativeIndex: number) => void
    handleAction: (action: 'accept' | 'reject', cardIndex: number) => void
}

type HeaderProps = {
    selected: 'cards' | 'text',
    setSelected: Dispatch<SetStateAction<'cards' | 'text'>>
    clearCard: () => void
}

export default function Edit({ params }: { params: { item: string[] } }) {
    const [selected, setSelected] = useState<'cards' | 'text'>('cards')
    const [rejected, setRejected] = useState<Card[]>([])
    const [editing, setEditing] = useState<Editing>({ cards: [], texts: [] })
    const [accepted, setAccepted] = useState<Card[]>([])
    const [text, setText] = useState(editing.texts.join('\n\n'))
    const editingSpan = selected === 'cards' ? 'col-span-2' : 'col-span-3'
    const [alternativeIndex, setAlternativeIndex] = useState(0)
    const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])
    const emptyCard: Card = {
        question: "",
        alternatives: [""],
        correct: 0,
        help: ""
    }
    const [card, setCard] = useState<Card>(emptyCard)

    const item = params.item[0].toUpperCase()

    useEffect(() => {
        (async () => {
            const newCourse = await getCourse(item)

            if (newCourse) {
                if (!editing.cards.length && typeof newCourse === 'object') {
                    if (!accepted.length) {
                        setAccepted(newCourse.cards)
                    }

                    if (!text.length) {
                        setText(newCourse.textUnreviewed.join('\n\n'))
                    }
    
                    setEditing({
                        texts: newCourse.textUnreviewed,
                        cards: newCourse.unreviewed,
                    } as Editing)
                }
            }
        })()
    }, [item])

    useEffect(() => {
        editing.cards.forEach((card, cardIndex) => {
            card.alternatives.forEach((_, index) => {
                const ref = textareaRefs.current[cardIndex * card.alternatives.length + index]
                if (ref) {
                    autoResizeTextarea(ref)
                }
            })
        })
    }, [editing.cards, selected])
    
    function handleSubmit() {
        updateCourse({courseID: item, accepted, editing})
    }

    function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(e.target.value)
        setEditing({...editing, texts: e.target.value.split('\n\n')})
    }

    function addCard() {
        if (!card.question) {
            return
        }

        const cardIndex = accepted.findIndex((c) => c.question === card.question)
        if (cardIndex !== -1) {
            const tempAccepted = [...accepted]
            tempAccepted[cardIndex] = card
            tempAccepted[cardIndex].alternatives = card.alternatives.filter((alternative) => alternative.length)
            console.log(tempAccepted)
            setAccepted(tempAccepted)
            setCard(emptyCard)
            return
        } 

        setAccepted([...accepted, card])
        setCard(emptyCard)
        setAlternativeIndex(0)
    }

    function handleAcceptedIndexClick(index: number) {
        if (selected === 'text') {
            setCard(accepted[index])
            setAlternativeIndex(accepted[index].alternatives.length - 1)
        } else {
            const tempCards = [...accepted]
            const card = tempCards.splice(index, 1)[0]
            setEditing({...editing, cards: [...editing.cards, card]})
            setAccepted(tempCards)
        }
    }

    function handleRejectedIndexClick(index: number) {
        const tempCards = [...rejected]
        const card = tempCards.splice(index, 1)[0]
        setEditing({...editing, cards: [...editing.cards, card]})
        setRejected(tempCards)
    }

    function handleQuestionChange(event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number) {
        const tempCards = [...editing.cards]
        tempCards[cardIndex] = {...tempCards[cardIndex], question: event.target.value}
        setEditing({...editing, cards: tempCards})
        autoResizeTextarea(event.target)
    }

    function handleAlternativeChange(event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number, alternativeIndex: number) {
        const tempCards = [...editing.cards]
        const tempAlternatives = [...tempCards[cardIndex].alternatives]
        tempAlternatives[alternativeIndex] = event.target.value
        tempCards[cardIndex] = {...tempCards[cardIndex], alternatives: tempAlternatives}
        setEditing({...editing, cards: tempCards})
        autoResizeTextarea(event.target)
    }

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    function setCorrectAnswer(index: number, cardIndex: number) {
        const tempCards = [...editing.cards]
        tempCards[cardIndex] = {...tempCards[cardIndex], correct: index}
        setEditing({...editing, cards: tempCards})
    }

    function handleAction(action: 'accept' | 'reject', cardIndex: number) {
        const tempCards = [...editing.cards]
        const card = tempCards.splice(cardIndex, 1)[0]
        if (action === 'accept') {
            setAccepted([...accepted, card])
        } else {
            setRejected([...rejected, card])
        }
        setEditing({...editing, cards: tempCards})
    }

    function clearCard() {
        setCard(emptyCard)
        setAlternativeIndex(0)
    }
 
    return (
        <div className="w-full h-full rounded-xl gap-8 grid grid-rows-12">
            <div className="w-full h-full grid grid-cols-4 gap-8 row-span-11">
                <Rejected selected={selected} rejected={rejected} handleRejectedIndexClick={handleRejectedIndexClick} />
                <div className={`w-full h-[76vh] bg-gray-800 ${editingSpan} rounded-xl p-4 flex flex-col`}>
                    <Header selected={selected} setSelected={setSelected} clearCard={clearCard} />
                    <div className="w-full h-[68vh]">
                        {selected === 'cards' ? (
                            <EditCards 
                                editing={editing} 
                                textareaRefs={textareaRefs} 
                                handleQuestionChange={handleQuestionChange} 
                                setCorrectAnswer={setCorrectAnswer} 
                                handleAlternativeChange={handleAlternativeChange} 
                                handleAction={handleAction}
                            />
                        ) : (
                            <div className="w-full h-full grid grid-cols-2 gap-4">
                                <textarea 
                                    value={text} 
                                    onChange={handleTextChange}
                                    className="w-full h-full overflow-auto noscroll bg-gray-600 rounded-xl p-2" 
                                />
                                <AddCard
                                    courseID={item}
                                    card={card}
                                    setCard={setCard}
                                    addCard={addCard}
                                    alternativeIndex={alternativeIndex}
                                    setAlternativeIndex={setAlternativeIndex}
                                />
                            </div>
                        )}
                        </div>
                </div>
                <Accepted 
                    accepted={accepted} 
                    setAccepted={setAccepted}
                    handleAcceptedIndexClick={handleAcceptedIndexClick}
                />
            </div>
            <div className="w-full h-full grid place-items-center">
                <Link
                    href={`/`}
                    onClick={handleSubmit}
                    className="h-full rounded-xl bg-gray-800 px-8 text-2xl grid place-items-center"
                >
                    Publish changes
                </Link>
            </div>
        </div>
    )
}

function AddCard({courseID, card, setCard, addCard, alternativeIndex, setAlternativeIndex} : AddCardProps) {
    function updateQuestion (question: string) {
        setCard({...card, question})
        setAlternativeIndex(0)
    }

    function handleAlternativeClick(index: number) {
        setAlternativeIndex(index)
    }

    function removeAlternative(index: number) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives.splice(index, 1)
        setCard({...card, alternatives: tempAlternatives})
    }

    return (
        <div className="w-full h-full overflow-auto noscroll">
            <div className="grid grid-cols-12 w-full">
                <h1 className="flex items-center justify-start text-lg col-span-1 h-[4vh]">Q:</h1>
                <textarea
                    value={card.question} 
                    onChange={(e) => updateQuestion(e.target.value)}
                    placeholder={`Add question about ${courseID}...`}
                    className="col-span-11 bg-gray-700 h-[4vh] rounded-xl px-2 min-h-[20vh]"
                />
            </div>
            <div className="grid grid-cols-12 w-full">
                <div className="col-span-1" />
                <div className="col-span-11">
                    {card.alternatives.map((alternative, index) => (
                        <div className="grid grid-cols-12">
                            <button 
                                onClick={() => handleAlternativeClick(index)} 
                                key={alternative} 
                                className="w-full text-left col-span-11"
                            >
                                {alternative} {`${card.correct === index ? '(correct)' : '(wrong)'}`}
                            </button>
                            <button onClick={() => removeAlternative(index)}>❌</button>
                        </div>
                    ))}
                </div>
            </div>
            <Alternative
                card={card}
                setCard={setCard}
                alternativeIndex={alternativeIndex}
                setAlternativeIndex={setAlternativeIndex}
            />
            <button 
                className="w-full h-[4vh] text-lg place-self-center bg-orange-500 rounded-xl mt-2"
                onClick={addCard}
            >Add card</button>
        </div>
    )
}

function Alternative({card, setCard, alternativeIndex, setAlternativeIndex}: AlternativeProps) {
    // Updates the alternative in the course object
    function handleInput(input: string) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives[alternativeIndex] = input
        setCard({...card, alternatives: tempAlternatives})
    }

    // Adds a new alternative to the current card
    function handleAddAlternative() {
        // Aborts if the current alternative is empty
        if (!card.alternatives[alternativeIndex]) {
            return
        }

        const alternatives = [...card.alternatives, ""]
        setCard({...card, alternatives})
        setAlternativeIndex(alternativeIndex + 1)
    }

    // Sets the selected alternative to be the correct one for the card
    function handleSetCorrectAlternative() {
        setCard({...card, correct: alternativeIndex})
    }

    return (
        <div className="w-full mt-2">
            <div className="grid grid-cols-12 mb-2">
                <h1 className="flex items-center justify-start text-lg col-span-1 h-[4vh]">{alternativeIndex + 1}:</h1>
                <div className="w-full col-span-11 flex flex-cols-auto">
                    <input 
                        value={card.alternatives[alternativeIndex]} 
                        onChange={(e) => handleInput(e.target.value)} 
                        type="text"
                        placeholder={`Alternative ${alternativeIndex + 1}`}
                        className="w-full bg-gray-700 h-[4vh] rounded-xl px-2 mr-4"
                    />
                    <button
                        value={Number(card.correct === alternativeIndex)}
                        className="h-full col-span-1 text-4xl col-span-1"
                        onClick={handleSetCorrectAlternative}
                    >
                        ✅
                    </button>
                </div>
            </div>
            <button 
                className="w-full h-[4vh] bg-orange-500 rounded-lg text-xl"
                onClick={handleAddAlternative}
            >Add alternative</button>
        </div>
    )
}

function Accepted({accepted, setAccepted, handleAcceptedIndexClick}: AcceptedProps) {

    function handleRemove(index: number) {
        const tempAccepted = [...accepted]
        tempAccepted.splice(index, 1)
        setAccepted(tempAccepted)
    }

    return (
        <div className="w-full h-full bg-gray-800 rounded-xl p-4">
            <h1 className="text-2xl mb-4">Accepted</h1>
            <div>
                {accepted.map((card: Card, index: number) => (
                    <div className="grid grid-cols-12">
                        <button
                            key={card.question}
                            onClick={() => handleAcceptedIndexClick(index)} 
                            className="w-full bg-gray-700 rounded-xl p-2 flex flex-rows space-x-2 mb-2 col-span-11"
                        >
                            <h1>{card.question.slice(0, 40)}...</h1>
                            <h1 className="text-gray-500">{card.alternatives.length}</h1>
                        </button>
                        <button onClick={() => handleRemove(index)}>❌</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Rejected({selected, rejected, handleRejectedIndexClick}: RejectedProps) {
    if (selected === 'cards') {
        return (
            <div className="w-full h-full bg-gray-800 rounded-xl p-4">
                <h1 className="text-2xl">Rejected</h1>
                <div>
                    {rejected.map((card: Card, index: number) => (
                        <button
                            key={card.question}
                            onClick={() => handleRejectedIndexClick(index)} 
                            className="w-full bg-gray-700 rounded-xl p-2 flex flex-rows space-x-2 mb-2"
                        >
                            <h1>{card.question.slice(0, 40)}...</h1>
                            <h1 className="text-gray-500">{card.alternatives.length}</h1>
                        </button>
                    ))}
                </div>
            </div>
        )
    }
}

function EditCards({editing, textareaRefs, handleQuestionChange, setCorrectAnswer, handleAlternativeChange, handleAction}: EditCardsProps) {
    return (
        <div className="w-full h-full overflow-auto noscroll">
            {editing.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="w-full">
                    <textarea
                        ref={(el) => { textareaRefs.current[cardIndex] = el }}
                        className="bg-gray-600 p-2 w-full rounded-xl"
                        value={card.question}
                        onChange={(event) => handleQuestionChange(event, cardIndex)}
                        style={{ overflow: 'hidden', resize: 'none', whiteSpace: 'pre-wrap'}}
                    />
                    <div className="bg-gray-700 rounded-xl">
                        {card.alternatives.map((answer, index) => (
                            <div key={index} className="p-2 grid grid-col w-full">
                                <button className="text-left" onClick={() => setCorrectAnswer(index, cardIndex)}>
                                    {index + 1}{card.correct === index ? "✅" : "❌"}. 
                                </button>
                                <textarea
                                    key={index}
                                    ref={(el) => { textareaRefs.current[cardIndex * card.alternatives.length + index] = el }}
                                    className="bg-gray-600 p-2 w-full rounded-xl"
                                    value={answer}
                                    onChange={(event) => handleAlternativeChange(event, cardIndex, index)}
                                    style={{ overflow: 'hidden', resize: 'none' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full grid grid-cols-4 gap-8 h-[4vh] mt-5 mb-5">
                        <div/>
                            <button 
                                className="bg-orange-500 w-full rounded-xl" 
                                onClick={() => handleAction('reject', cardIndex)}
                            >
                                Reject
                            </button>
                            <button 
                                className="bg-orange-500 w-full rounded-xl" 
                                onClick={() => handleAction('accept', cardIndex)}
                            >
                                Accept
                            </button>
                        <div/>
                    </div>
                </div>    
            ))}
        </div>
    )
}

function Header({selected, setSelected, clearCard}: HeaderProps) {
    const editingCols = selected === 'cards' ? 'grid-cols-4' : 'grid-cols-4'
    const editingColSpan = selected === 'cards' ? 'col-span-3' : 'col-span-3'
    const isText = selected === 'text'

    return (
        <div className={`w-full flex space-between grid ${editingCols} mb-4`}>
            <h1 className={`text-2xl ${editingColSpan}`}>Editing {selected}</h1>
            <div className={`grid ${isText ? "grid-cols-3" : "grid-cols-2"} place-items-center gap-4`}>
                {isText && <button 
                    className="bg-gray-700 w-full h-full rounded-lg" 
                    onClick={clearCard}
                >
                    Clear
                </button>}
                <button 
                    className="bg-gray-700 w-full h-full rounded-lg" 
                    onClick={() => setSelected('cards')}
                >
                    Cards
                </button>
                <button 
                    className="bg-gray-700 w-full h-full rounded-lg" 
                    onClick={() => setSelected('text')}
                >
                    Text
                </button>
            </div>
        </div>
    )
}