'use client'

import getCookie from "@/utils/cookies"
import { addCourse, addCard, addText } from "@utils/fetch"
import Link from "next/link"
import { Dispatch, SetStateAction, useState } from "react"

type TextOrNormalProps = {
    cards: FlashCard[]
    setCards: Dispatch<SetStateAction<FlashCard[]>>
    text: string
    setText: (text: string) => void
}

type AddCardProps = {
    cards?: FlashCard[]
    setCards?: (cards: FlashCard[]) => void
}

type AddTextProps = {
    text?: string
    setText?: (text: string) => void
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
        case 'card': return <AddCard />
        case 'text': return <AddText />
        default: return <h1>404</h1>
    }
}

function AddCourse() {
    const user = JSON.parse(getCookie('user') || '{ "id": 0 }')
    const [course, setCourse] = useState("")
    const [cards, setCards] = useState<FlashCard[]>([])
    const [text, setText] = useState("")
    const [error, setError] = useState("")

    const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
    const inputParent = "grid grid-cols-8 w-full h-full space-between"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-gray-800 w-[35vw] h-[45vh] rounded-xl grid place-items-center grid grid-rows-6 gap-4 p-5 px-10">
                <h1 className=" text-3xl font-semibold">Add course</h1>
                <div className={inputParent}>
                    <h1 className={inputText}>Course name:</h1>
                    <input 
                        value={course} 
                        onChange={(e) => setCourse(e.target.value)} 
                        type="text" 
                        placeholder="Course name" 
                        className={input} 
                    />
                </div>
                <div className={inputParent}>
                    <h1 className={inputText}>Questions:</h1>
                    <TextOrNormal
                        cards={cards}
                        setCards={setCards} 
                        text={text} 
                        setText={setText} 
                    />
                </div>
                <Link 
                    href={!error ? '/' : '/register'}
                    className="grid w-full h-full bg-orange-500 rounded-xl" 
                    onClick={() => addCourse({
                        id: user.id,
                        course,
                        content: cards
                    })}>
                    <h1 className="text-2xl place-self-center">Create account</h1>
                </Link>
                <div className={inputParent} /> 
            </div>  
        </div>
    )
}

function AddCard({cards, setCards}: AddCardProps) {
    const [question, setQuestion] = useState("")
    const [error, setError] = useState("")

    const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
    const inputParent = "grid grid-cols-8 w-full h-full space-between"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-gray-800 w-[35vw] h-[45vh] rounded-xl grid place-items-center grid grid-rows-6 gap-4 p-5 px-10">
                <h1 className=" text-3xl font-semibold">Add question</h1>
                <div className={inputParent}>
                    <h1 className={inputText}>Question:</h1>
                    <input 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                        type="text" 
                        placeholder="Course name" 
                        className={input} 
                    />
                </div>
                <Link 
                    href={!error ? '/' : '/register'}
                    className="grid w-full h-full bg-orange-500 rounded-xl" 
                    // onClick={() => addCard({
                    //     user_id,
                    //     course_id,
                    //     flashcard
                    // })}
                >
                    <h1 className="text-2xl place-self-center">Create account</h1>
                </Link>
                <div className={inputParent} /> 
            </div>  
        </div>
    )
}

function AddText({text, setText}: AddTextProps) {
    const [course, setCourse] = useState("")
    const [error, setError] = useState("")

    const input = "bg-gray-600 rounded-xl overflow-hidden px-8 col-span-6"
    const inputParent = "grid grid-cols-8 w-full h-full space-between"
    const inputText = "text-xl flex items-center justify-start col-span-2"

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="bg-gray-800 w-[35vw] h-[45vh] rounded-xl grid place-items-center grid grid-rows-6 gap-4 p-5 px-10">
                <h1 className=" text-3xl font-semibold">Add course</h1>
                <div className={inputParent}>
                    <h1 className={inputText}>Course name:</h1>
                    <input 
                        value={course} 
                        onChange={(e) => setCourse(e.target.value)} 
                        type="text" 
                        placeholder="Course name" 
                        className={input} 
                    />
                </div>
                <Link 
                    href={!error ? '/' : '/register'}
                    className="grid w-full h-full bg-orange-500 rounded-xl" 
                    // onClick={() => addText({
                    //     user_id,
                    //     course_id,
                    //     text
                    // })}
                >
                    <h1 className="text-2xl place-self-center">Create account</h1>
                </Link>
                <div className={inputParent} /> 
            </div>  
        </div>
    )
}

function TextOrNormal({cards, setCards, text, setText}: TextOrNormalProps) {
    const [selected, setSelected] = useState(0)

    function handleClick(input: number) {
        setSelected(input)
    }

    return (
        <div className="w-full h-full bg-red-200 grid grid-rows-2">
            {selected === 0 ? <button className="h-full w-full bg-gray-500" onClick={() => handleClick(1)}>Questions</button> : null}
            {selected === 1 ? <AddCard cards={cards} setCards={setCards} /> : null}
            {selected === 0 ? <button className="h-full w-full bg-gray-500" onClick={() => handleClick(2)}>Text field</button> : null}
            {selected === 2 ? <AddText text={text} setText={setText} /> : null}
        </div>
    )
}