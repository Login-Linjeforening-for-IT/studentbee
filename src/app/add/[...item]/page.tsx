'use client'

import { addCourse, addCard, addText } from "@utils/fetchClient"
import Link from "next/link"
import { Dispatch, SetStateAction, useState } from "react"

type TextOrNormalProps = {
    course: Course
    setCourse: Dispatch<SetStateAction<Course>>
    selected: number
    setSelected: Dispatch<SetStateAction<number>>
}

type AddCardProps = {
    course: Course
    setCourse: Dispatch<SetStateAction<Course>>
    cardIndex: number
    alternativeIndex: number
    setCardIndex: Dispatch<SetStateAction<number>>
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

type AddTextForCourseProps = {
    course: Course
    setCourse: Dispatch<SetStateAction<Course>>
}

type AlternativeProps = {
    course: Course
    setCourse: Dispatch<SetStateAction<Course>>
    cardIndex: number
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

export default function Add({ params }: { params: { item: string[] } }) {
    const item = params.item[0].toUpperCase()

    if (!item) {
        return (
            <div>
                <Link href='/add/course'>Add course</Link>
                <Link href='/add/card'>Add card</Link>
                <Link href='/add/text'>Add text</Link>
            </div>
        )
    }

    switch (item) {
        case 'COURSE': return <AddCourse /> 
        // case 'card': return <AddCard />
        // case 'text': return <AddText />
        default: return <h1>404</h1>
    }
}

function AddCourse() {
    const [error, setError] = useState("")
    const emptyCard: Card = {
        question: "",
        alternatives: [""],
        correct: 0,
    }
    const emptyCourse = {
        id: "",
        cards: [],
        unreviewed: [emptyCard],
        textUnreviewed: [],
    }
    const [course, setCourse] = useState<Course>(emptyCourse)
    const [selected, setSelected] = useState(0)
    const courseIDspan = selected === 0 ? "col-span-12" : "col-span-10"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    function handleCourseNameChange(courseName: string) {
        setCourse({ ...course, id: courseName})
    }

    async function handleAddCourse() {
        const err = await addCourse(course)

        if (typeof err === 'string') {
            setError(err)
        }
    }

    function handleBack() {
        setSelected(0)
    }

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-dark w-[35vw] rounded-xl grid place-items-center gap-4 p-5 px-10 max-h-[75vh] overflow-auto">
                <div className="grid grid-cols-12 w-full">
                    {selected != 0 ? <button className="text-2xl bg-dark rounded-md px-2" onClick={handleBack}>⬅️</button> : null}
                    <h1 className={`text-3xl font-semibold ${courseIDspan} text-center`}>Add course</h1>
                    <h1 className={`text-md text-red-500 ${courseIDspan} text-center`}>{error}</h1>
                    {selected != 0 ? <div/> : null}
                </div>
                <div className="grid grid-cols-8 w-full space-between h-[5vh]">
                    <h1 className={inputText}>Course ID:</h1>
                    <input 
                        value={course.id} 
                        onChange={(event) => handleCourseNameChange(event.target.value.toUpperCase())} 
                        type="text"
                        placeholder="Course name"
                        className="bg-light rounded-xl overflow-hidden px-2 col-span-6"
                    />
                </div>
                <TextOrNormal course={course} setCourse={setCourse} selected={selected} setSelected={setSelected} />
                <Link
                    href={error.length ? '/add/course/' : `/course/${course.id}`}
                    className="grid w-full bg-orange-500 rounded-xl text-xl h-[5vh] place-items-center" 
                    onClick={handleAddCourse}
                >
                    Add course
                </Link>
            </div>  
        </div>
    )
}

function TextOrNormal({course, setCourse, selected, setSelected}: TextOrNormalProps) {
    const [cardIndex, setCardIndex] = useState(0)
    const [alternativeIndex, setAlternativeIndex] = useState(0)
    const cols = selected === 0 ? 'grid grid-cols-2 gap-4 h-[5vh]' : ''

    function handleClick(input: number) {
        setSelected(input)
    }

    function handleCardClick(index: number) {
        setCardIndex(index)
        setAlternativeIndex(0)
    }

    return (
        <div className={`w-full ${cols}`}>
            {selected === 0 ? <button className="w-full h-full bg-orange-500 rounded-xl text-xl" onClick={() => handleClick(1)}>Add questions</button> : null}
            {selected === 1 ? <div className="grid w-full">
                <div className="mb-2">
                    {course.unreviewed.map((card, index) => {
                        if (!card.question.length || card.alternatives.length < 2) {
                            return
                        }

                        return (
                            <button className="w-full text-left" key={index} onClick={() => handleCardClick(index)}>
                                {card.question} {card.question != "" ? `(${card.alternatives.length} alts)` : ''}
                            </button>
                        )
                    })}
                </div>
            </div> : null}
            {selected === 1 ? <AddCardForCourse 
                course={course} 
                setCourse={setCourse} 
                cardIndex={cardIndex} 
                alternativeIndex={alternativeIndex}
                setCardIndex={setCardIndex}
                setAlternativeIndex={setAlternativeIndex}
            /> : null}
            {selected === 0 ? <button className="w-full h-full bg-orange-500 rounded-xl text-xl" onClick={() => handleClick(2)}>Add text field</button> : null}
            {selected === 2 ? <AddTextForCourse course={course} setCourse={setCourse} /> : null}
        </div>
    )
}

function AddTextForCourse({course, setCourse}: AddTextForCourseProps) {
    function handleChange(text: string) {
        setCourse({...course, textUnreviewed: [...course.textUnreviewed, text]})
    }

    return (
        <div className="w-full h-full">
            <h1 className="text-sm mb-4 text-gray-500">Paste a text block or previous exam here. Remove everything except the questions and alternatives. Mark the correct alternative if known. It will be manually parsed to cards later.</h1>
            <textarea
                value={course.textUnreviewed} 
                onChange={(event) => handleChange(event.target.value)} 
                placeholder="Paste an exam here..." 
                className="bg-light rounded-xl w-full p-2 min-h-[20vh]"
            />
        </div>
    )
}

function AddCardForCourse({course, setCourse, cardIndex, alternativeIndex, setCardIndex, setAlternativeIndex}: AddCardProps) {
    
    // Updates the question of the selected course in the course object
    function updateCardQuestion(question: string) {
        const tempCards = [...course.unreviewed]
        tempCards[cardIndex].question = question
        setCourse({...course, unreviewed: tempCards})
    }

    // Adds a new card to the course
    function addCardToCourse() {
        // Aborts if there is no question or less than 2 alternatives
        if (course.unreviewed[cardIndex].question === "" || course.unreviewed[cardIndex].alternatives.length < 2) {
            return
        }

        const tempCards = [...course.unreviewed, { question: "", alternatives: [], correct: 0}]
        setCourse({...course, unreviewed: tempCards})
        setCardIndex(cardIndex + 1)
        setAlternativeIndex(0)
    }

    function handleAlternativeClick(index: number) {
        setAlternativeIndex(index)
    }

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="grid grid-cols-8 w-full">
                <h1 className="flex items-center justify-start text-xl col-span-2 h-[5vh]">Question:</h1>
                <input 
                    value={course.unreviewed[cardIndex].question} 
                    onChange={(event) => updateCardQuestion(event.target.value)}
                    type="text" 
                    placeholder={`Question about ${course.id}...`}
                    className="col-span-6 bg-light h-[5vh] rounded-xl px-2"
                />
            </div>
            <div className="grid grid-cols-8 w-full mt-4">
                <div className="col-span-2" />
                <div className="col-span-6">
                    {course.unreviewed[cardIndex].alternatives.map((alternative, index) => {
                        if (!alternative.length) {
                            return
                        }

                        return (
                            <button 
                                onClick={() => handleAlternativeClick(index)} 
                                key={alternative} 
                                className="w-full text-left"
                            >{alternative} {`${course.unreviewed[cardIndex].correct === index ? '(correct)' : '(wrong)'}`}</button>
                        )
                    })}
                </div>
            </div>
            <Alternative
                course={course}
                setCourse={setCourse}
                cardIndex={cardIndex}
                alternativeIndex={alternativeIndex}
                setAlternativeIndex={setAlternativeIndex}
            />
            <button 
                className="w-full h-[5vh] text-xl place-self-center bg-orange-500 rounded-xl mt-4"
                onClick={addCardToCourse}
            >Add card</button>
        </div>
    )
}

function Alternative({course, setCourse, cardIndex, alternativeIndex, setAlternativeIndex}: AlternativeProps) {
    // Updates the alternative in the course object
    function handleInput(input: string) {
        const tempCards = [...course.unreviewed]
        const tempAlternatives = [...tempCards[cardIndex].alternatives]
        tempAlternatives[alternativeIndex] = input
        tempCards[cardIndex].alternatives = tempAlternatives
        setCourse({...course, unreviewed: tempCards})
    }

    // Adds a new alternative to the current card
    function handleAddAlternative() {
        // Aborts if the current alternative is empty
        if (!course.unreviewed[cardIndex].alternatives[alternativeIndex]) {
            return
        }

        const tempCards = [...course.unreviewed]
        const tempAlternatives = [...tempCards[cardIndex].alternatives, ""]
        tempCards[cardIndex].alternatives = tempAlternatives
        setCourse({...course, unreviewed: tempCards})
        setAlternativeIndex(alternativeIndex + 1)
    }

    // Sets the selected alternative to be the correct one for the card
    function handleSetCorrectAlternative() {
        const tempCards = [...course.unreviewed]
        tempCards[cardIndex].correct = alternativeIndex
        setCourse({...course, unreviewed: tempCards})
    }

    return (
        <div className="w-full mt-2">
            <div className="grid grid-cols-8 mb-4">
                <h1 className="flex items-center justify-start text-xl col-span-2 h-[5vh]">Alternative {alternativeIndex + 1}:</h1>
                <div className="w-full col-span-6 flex flex-cols-auto">
                    <input 
                        value={course.unreviewed[cardIndex].alternatives[alternativeIndex]} 
                        onChange={(event) => handleInput(event.target.value)} 
                        type="text"
                        placeholder={`Alternative ${alternativeIndex + 1}`}
                        className="w-full bg-light h-[5vh] rounded-xl px-2 mr-4"
                    />
                    <button
                        value={Number(course.unreviewed[cardIndex].correct === alternativeIndex)}
                        className="h-full col-span-1 text-5xl col-span-1"
                        onClick={handleSetCorrectAlternative}
                    >
                        ✅
                    </button>
                </div>
            </div>
            <button 
                className="w-full h-[5vh] bg-orange-500 rounded-xl text-xl"
                onClick={handleAddAlternative}
            >Add alternative</button>
        </div>
    )
}
