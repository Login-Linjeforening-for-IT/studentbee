'use client'

import { getCourse, updateCourse } from "@/utils/fetch"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

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

export default function Edit({ params }: { params: { item: string[] } }) {
    const [course, setCourse] = useState<Course | string>()
    const [selected, setSelected] = useState<'cards' | 'text'>('cards')
    const [rejected, setRejected] = useState<Card[]>([])
    const [editing, setEditing] = useState<Editing>({ cards: [], texts: [] })
    const [accepted, setAccepted] = useState<Card[]>([])
    const [text, setText] = useState(editing.texts.join('\n\n'))
    const [alternativeIndex, setAlternativeIndex] = useState(0)
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
                setCourse(newCourse)
                if (!editing.cards.length && typeof newCourse === 'object') {
                    if (!accepted.length) {
                        setAccepted(newCourse.cards)
                    }

                    if (!text.length) {
                        setText(newCourse.textUnreviewed.join('\n\n'))
                    }
    
                    setEditing({
                        texts: newCourse.textUnreviewed,
                        cards: newCourse.cards,
                    } as Editing)
                }
            }
        })()
    }, [item])
    
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
            setAccepted(tempAccepted)
            setCard(emptyCard)
            return
        } 

        setAccepted([...accepted, card])
        setCard(emptyCard)
        setAlternativeIndex(0)
    }

    function handleAcceptedIndexClick(index: number) {
        setCard(accepted[index])
        setAlternativeIndex(accepted[index].alternatives.length - 1)
    }

    return (
        <div className="w-full h-full rounded-xl gap-8 grid grid-rows-12">
            <div className="w-full h-full grid grid-cols-4 gap-8 row-span-11">
                <div className="w-full h-full bg-gray-800 rounded-xl p-4">
                    <h1 className="text-2xl">Rejected</h1>
                    <div>
                        {rejected.map((card: Card, index: number) => (
                            <button 
                                key={card.question}
                                onClick={() => handleAcceptedIndexClick(index)} 
                                className="w-full bg-gray-700 rounded-xl p-2 flex flex-rows space-x-2 mb-2"
                            >
                                <h1>{card.question}</h1>
                                <h1 className="text-gray-500">{card.alternatives.length}</h1>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full h-[76vh] bg-gray-800 col-span-2 rounded-xl p-4 flex flex-col">
                    <div className="w-full flex space-between grid grid-cols-4 mb-4">
                        <h1 className="text-2xl col-span-3">Editing {selected}</h1>
                        <div className="grid grid-cols-2 place-items-center gap-4">
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
                    <div className="w-full h-[68vh]">
                        {selected === 'cards' ? (
                            <div className="w-full h-full overflow-auto">
                                {editing.cards.map((card) => (
                                    <div key={card.question} className="w-full h-full">
                                        <h1>{card.question}</h1>
                                        <div>
                                            {card.alternatives.map((answer, index) => <div key={answer}>
                                                <h1>{index + 1}</h1>
                                                <h1>{answer}</h1>
                                                {card.correct === index && <h1>Correct</h1>}
                                            </div>)}
                                        </div>
                                    </div>    
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full grid grid-cols-2 gap-4">
                                <textarea 
                                    value={text} 
                                    onChange={handleTextChange}
                                    className="w-full h-full overflow-auto noscroll bg-gray-600 rounded-xl p-2" />
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
                <div className="w-full h-full bg-gray-800 rounded-xl p-4">
                    <h1 className="text-2xl mb-4">Accepted</h1>
                    <div>
                        {accepted.map((card: Card, index: number) => (
                            <button
                                key={card.question}
                                onClick={() => handleAcceptedIndexClick(index)} 
                                className="w-full bg-gray-700 rounded-xl p-2 flex flex-rows space-x-2 mb-2"
                            >
                                <h1>{card.question.slice(0, 40)}...</h1>
                                <h1 className="text-gray-500">{card.alternatives.length}</h1>
                            </button>
                        ))}
                    </div>
                </div>
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

    return (
        <div className="w-full h-full overflow-auto noscroll">
            <div className="grid grid-cols-8 w-full">
                <h1 className="flex items-center justify-start text-lg col-span-2 h-[4vh]">Question:</h1>
                <input 
                    value={card.question} 
                    onChange={(e) => updateQuestion(e.target.value)}
                    type="text" 
                    placeholder={`Add question about ${courseID}...`}
                    className="col-span-6 bg-gray-700 h-[4vh] rounded-xl px-2"
                />
            </div>
            <div className="grid grid-cols-8 w-full">
                <div className="col-span-2" />
                <div className="col-span-6">
                    {card.alternatives.map((alternative, index) => {
                        if (!alternative.length) {
                            return
                        }

                        return (
                            <button 
                                onClick={() => handleAlternativeClick(index)} 
                                key={alternative} 
                                className="w-full text-left"
                            >{alternative} {`${card.correct === index ? '(correct)' : '(wrong)'}`}</button>
                        )
                    })}
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
            <div className="grid grid-cols-8 mb-2">
                <h1 className="flex items-center justify-start text-lg col-span-2 h-[4vh]">{alternativeIndex + 1}:</h1>
                <div className="w-full col-span-6 flex flex-cols-auto">
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