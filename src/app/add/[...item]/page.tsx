'use client'

import getCookie from "@/utils/cookies"
import { addCourse, addCard, addText } from "@utils/fetch"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

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

type AddTextProps = {
    text?: string
    setText?: (text: string) => void
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
    const item = params.item[0]

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
        case 'course': return <AddCourse /> 
        // case 'card': return <AddCard />
        // case 'text': return <AddText />
        default: return <h1>404</h1>
    }
}

function AddCourse() {
    const [user, setUser] = useState({ id: 0 })
    const [error, setError] = useState("")
    const emptyCard: Card = {
        question: "",
        alternatives: [""],
        correct: 0,
        help: ""
    }
    const emptyCourse = {
        id: "",
        cards: [],
        unreviewed: [emptyCard],
        textUnreviewed: "",
    }

    const [course, setCourse] = useState<Course>(emptyCourse)
    const [selected, setSelected] = useState(0)
    const courseIDspan = selected === 0 ? "col-span-12" : "col-span-10"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    function handleCourseNameChange(courseName: string) {
        setCourse({ ...course, id: courseName})
    }

    function handleAddCourse() {
        const err = addCourse(course)

        if (err) {
            setError(err)
        }
    }

    function handleBack() {
        setSelected(0)
    }

    useEffect(() => {
        const cookie = getCookie('user')
        const userFromCookie = cookie ? JSON.parse(cookie) : undefined

        if (userFromCookie) {
            setUser(userFromCookie)
        }
    }, [])

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-gray-800 w-[35vw] rounded-xl grid place-items-center gap-4 p-5 px-10 max-h-[75vh] overflow-auto">
                <div className="grid grid-cols-12 w-full">
                    {selected != 0 ? <button className="text-2xl bg-gray-700 rounded-md px-2" onClick={handleBack}>&lt;</button> : null}
                    <h1 className={`text-3xl font-semibold ${courseIDspan} text-center`}>Add course</h1>
                    {selected != 0 ? <div/> : null}
                </div>
                <div className="grid grid-cols-8 w-full space-between h-[5vh]">
                    <h1 className={inputText}>Course name:</h1>
                    <input 
                        value={course.id} 
                        onChange={(e) => handleCourseNameChange(e.target.value)} 
                        type="text"
                        placeholder="Course name"
                        className="bg-gray-600 rounded-xl overflow-hidden px-2 col-span-6"
                    />
                </div>
                <TextOrNormal course={course} setCourse={setCourse} selected={selected} setSelected={setSelected} />
                <Link
                    href={!error ? '/' : `/course/${course}`}
                    className="grid w-full bg-orange-500 rounded-xl text-xl h-[5vh] place-items-center" 
                    onClick={handleAddCourse}>
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
                                {card.question} {card.question != "" ? `(${card.alternatives.length} alt)` : ''}
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
        setCourse({...course, textUnreviewed: text})
    }

    return (
        <div className="w-full h-full">
            <h1 className="text-sm mb-4 text-gray-500">Paste a text block or previous exam here. Remove everything except the questions and alternatives. Mark the correct alternative if known. It will be manually parsed to cards later.</h1>
            <textarea
                value={course.textUnreviewed} 
                onChange={(e) => handleChange(e.target.value)} 
                placeholder="Paste an exam here..." 
                className="bg-gray-600 rounded-xl w-full p-2 min-h-[20vh]"
            />
        </div>
    )
}

function AddCardForCourse({course, setCourse, cardIndex, alternativeIndex, setCardIndex, setAlternativeIndex}: AddCardProps) {
    const emptyCard = { question: "", alternatives: [], correct: 0 }
    
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

        const tempCards = [...course.unreviewed, emptyCard]
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
                    onChange={(e) => updateCardQuestion(e.target.value)}
                    type="text" 
                    placeholder={`Question about ${course.id}...`}
                    className="col-span-6 bg-gray-600 h-[5vh] rounded-xl px-2"
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
                            >{alternative}</button>
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
        if (course.unreviewed[cardIndex].alternatives[alternativeIndex] === "") {
            return
        }

        const tempCards = [...course.unreviewed]
        const tempAlternatives = [...tempCards[cardIndex].alternatives, ""]
        tempCards[cardIndex].alternatives = tempAlternatives
        setCourse({...course, unreviewed: tempCards})
        setAlternativeIndex(alternativeIndex + 1)
    }

    return (
        <div className="w-full mt-2">
            <div className="grid grid-cols-8 mb-4">
                <h1 className="flex items-center justify-start text-xl col-span-2 h-[5vh]">Alternative {alternativeIndex + 1}:</h1>
                <input 
                    value={course.unreviewed[cardIndex].alternatives[alternativeIndex]} 
                    onChange={(e) => handleInput(e.target.value)} 
                    type="text"
                    placeholder={`Alternative ${alternativeIndex + 1}`}
                    className="col-span-6 bg-gray-600 h-[5vh] rounded-xl px-2"
                />
            </div>
            <button 
                className="w-full h-[5vh] bg-orange-500 rounded-xl text-xl"
                onClick={handleAddAlternative}
            >Add alternative</button>
        </div>
    )
}


// function AddCard({cards, setCards}: AddCardProps) {
//     const [question, setQuestion] = useState("")
//     const [error, setError] = useState("")

//     const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
//     const inputParent = "grid grid-cols-8 w-full h-full space-between"
//     const inputText = "text-xl flex items-center justify-start col-span-2"

//     return (
//         <div className="w-full h-full grid place-items-center">
//             <div className="bg-gray-800 w-[35vw] h-[45vh] rounded-xl grid place-items-center grid grid-rows-6 gap-4 p-5 px-10">
//                 <h1 className=" text-3xl font-semibold">Add card</h1>
//                 <div className={inputParent}>
//                     <h1 className={inputText}>Question:</h1>
//                     <input 
//                         value={question} 
//                         onChange={(e) => setQuestion(e.target.value)} 
//                         type="text" 
//                         placeholder="Course name" 
//                         className={input} 
//                     />
//                 </div>
//                 <Link 
//                     href={!error ? '/' : '/register'}
//                     className="grid w-full h-full bg-orange-500 rounded-xl" 
//                     // onClick={() => addCard({
//                     //     user_id,
//                     //     course_id,
//                     //     card
//                     // })}
//                 >
//                     <h1 className="text-xl place-self-center">Add card</h1>
//                 </Link>
//                 <div className={inputParent} /> 
//             </div>  
//         </div>
//     )
// }

// function AddText({text, setText}: AddTextProps) {
//     const [course, setCourse] = useState("")
//     const [error, setError] = useState("")

//     const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
//     const inputParent = "grid grid-cols-8 w-full h-full space-between"
//     const inputText = "text-xl flex items-center justify-start col-span-2"

//     return (
//         <div className="w-full h-full grid place-items-center">
//             <div className="bg-gray-800 w-[35vw] h-[45vh] rounded-xl grid place-items-center grid grid-rows-6 gap-4 p-5 px-10">
//                 <h1 className="text-3xl font-semibold">Add text</h1>
//                 <div className={inputParent}>
//                     <h1 className={inputText}>Course name:</h1>
//                     <input 
//                         value={course} 
//                         onChange={(e) => setCourse(e.target.value)} 
//                         type="text" 
//                         placeholder="Course name" 
//                         className={input} 
//                     />
//                 </div>
//                 <Link 
//                     href={!error ? '/' : '/register'}
//                     className="grid w-full h-full bg-orange-500 rounded-xl" 
//                     // onClick={() => addText({
//                     //     user_id,
//                     //     course_id,
//                     //     text
//                     // })}
//                 >
//                     <h1 className="text-xl place-self-center">Add text</h1>
//                 </Link>
//                 <div className={inputParent} /> 
//             </div>  
//         </div>
//     )
// }
