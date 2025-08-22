'use client'

import Editor from '@/components/editor/editor'
import { getCourse, updateCourse } from '@/utils/fetch'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState, use } from 'react'

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
    card: Card
    accepted: Card[]
    setAccepted: Dispatch<SetStateAction<Card[]>>
    handleAcceptedIndexClick: (index: number) => void
}

type HeaderProps = {
    clearCard: () => void
    editing: Editing
    setEditing: Dispatch<SetStateAction<Editing>>
    text: string
    setText: Dispatch<SetStateAction<string>>
    hideText: () => void
}

export default function Edit(props: { params: Promise<{ item: string[] }> }) {
    const params = use(props.params)
    const [editing, setEditing] = useState<Editing>({ cards: [], texts: [] })
    const [editingIndex, setEditingIndex] = useState(-1)
    const [accepted, setAccepted] = useState<Card[]>([])
    const [showText, setShowText] = useState(true)
    const [text, setText] = useState(editing.texts.join('\n\n'))
    const [alternativeIndex, setAlternativeIndex] = useState(0)
    const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])
    const emptyCard: Card = { question: '', alternatives: [''], correct: [], source: '', rating: 0, votes: [] }
    const [card, setCard] = useState<Card>(emptyCard)
    const item = params.item[0].toUpperCase()

    useEffect(() => {
        (async () => {
            const newCourse = await getCourse(item, 'client')

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
    }, [editing.cards])

    function handleSubmit() {
        updateCourse({courseID: item, accepted, editing})
    }

    function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value)
        setEditing({...editing, texts: event.target.value.split('\n\n')})
    }

    function addCard() {
        if (!card.question) {
            return
        }


        if (editingIndex !== -1) {
            const tempAccepted = [...accepted]
            tempAccepted[editingIndex] = card
            tempAccepted[editingIndex].alternatives = card.alternatives.filter((alternative) => alternative.length)
            setAccepted(tempAccepted)
            setCard(emptyCard)
            setEditingIndex(-1)
            return
        } 

        setAlternativeIndex(0)
        setAccepted([...accepted, {
            ...card,
            alternatives: card.alternatives.filter((alternative) => alternative.length)
        }])
        setCard({...emptyCard, source: card.source})
    }

    function handleAcceptedIndexClick(index: number) {
        setCard(accepted[index])
        setAlternativeIndex(accepted[index].alternatives.length - 1)
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
        <div className='w-full h-full rounded-xl gap-2 flex flex-col'>
            <div className='w-full h-full grid grid-cols-4 gap-2 min-h-[87vh]'>
                <div className={`w-full h-full bg-darker col-span-3 rounded-xl flex flex-col`}>
                    <Header
                        clearCard={clearCard} 
                        editing={editing}
                        setEditing={setEditing}
                        hideText={hideText}
                        text={text}
                        setText={setText}
                    />
                    <div className='w-full h-[68vh] px-2'>
                        <div className={`w-full h-full ${showText ? 'grid grid-cols-2 gap-2' : ''}`}>
                            {showText && <textarea
                                value={text}
                                onChange={handleTextChange}
                                className='w-full h-full overflow-auto noscroll bg-light rounded-xl p-2 resize-none whitespace-pre-wrap outline-hidden caret-orange-500'
                            />}
                            <AddCard
                                courseID={item}
                                card={card}
                                setCard={setCard}
                                addCard={addCard}
                                alternativeIndex={alternativeIndex}
                                setAlternativeIndex={setAlternativeIndex}
                            />
                        </div>
                    </div>
                </div>
                <Accepted 
                    card={card}
                    accepted={accepted} 
                    setAccepted={setAccepted}
                    handleAcceptedIndexClick={handleAcceptedIndexClick}
                />
            </div>
            <div className='w-full h-full grid place-items-center'>
                <Link
                    href={`/`}
                    onClick={handleSubmit}
                    className='h-full rounded-xl bg-login px-8 font-bold grid place-items-center'
                >
                    Publish changes
                </Link>
            </div>
        </div>
    )
}

function AddCard({
    courseID, 
    card, 
    setCard, 
    addCard, 
    alternativeIndex, 
    setAlternativeIndex
} : AddCardProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    function updateQuestion (question: string) {
        setCard({...card, question})
    }

    function updateTheme (theme: string) {
        setCard({...card, theme})
    }

    function updateSource (source: string) {
        setCard({...card, source})
    }

    function handleAlternativeClick(index: number) {
        setAlternativeIndex(index)
    }

    function removeAlternative(index: number) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives.splice(index, 1)
        setCard({...card, alternatives: tempAlternatives})
        setAlternativeIndex(alternativeIndex - 1 > 0 ? alternativeIndex - 1 : 0)
    }

    function handleSubmit() {
        addCard()
        
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    function addCorrect(index: number) {
        if (typeof card.correct === 'number') {
            setCard({...card, correct: [card.correct, index]})
        } else {
            setCard({...card, correct: [...card.correct, index]})
        }
    }

    function removeCorrect(index: number) {
        if (typeof card.correct === 'number') {
            setCard({...card, correct: []})
        } else {
            setCard({...card, correct: card.correct.filter((correctIndex) => correctIndex !== index)})
        }
    }

    return (
        <div className='w-full h-full overflow-auto noscroll'>
            <h1 className='flex items-center justify-start text-lg h-[4vh]'>Source</h1>
            <input
                className='bg-light p-1 pl-2 w-full rounded-xl h-[4vh] outline-hidden caret-orange-500'
                value={card.source}
                type='text'
                placeholder='Exam or learning material source'
                onChange={(event) => updateSource(event.target.value)}
            />
            <h1 className='flex items-center justify-start text-lg h-[4vh]'>Theme</h1>
            <input
                ref={inputRef}
                className='bg-light p-1 pl-2 w-full rounded-xl h-[4vh] outline-hidden caret-orange-500'
                value={card.theme}
                type='text'
                placeholder='Question theme (optional)'
                onChange={(event) => updateTheme(event.target.value)}
            />
            <h1 className='flex items-center justify-start text-lg col-span-1 h-[4vh]'>Question</h1>
            <div className='bg-light rounded-xl p-2'>
                <Editor
                    placeholder='Enter question...'
                    courseID={courseID}
                    value={card.question.split('\n')} 
                    customSaveLogic={true} 
                    save={() => {}}
                    onChange={updateQuestion}
                    hideSaveButton={true}
                />
            </div>
            <h1 className='flex items-center justify-start text-lg col-span-1 h-[4vh]'>Alternatives</h1>
            <div className='w-full'>
                {card.alternatives.map((alternative, index) => {
                    const isCorrect = typeof card.correct === 'number' ? card.correct === index : card.correct.includes(index)

                    if (index == card.alternatives.length - 1 && !alternative) {
                        return
                    }

                    return (
                        <div key={index} className='flex flex-rows max-w-full w-full'>
                            <h1 className='w-10 text-superlight'>{index + 1}</h1>
                            <button
                                onClick={() => handleAlternativeClick(index)} 
                                key={alternative} 
                                className='text-left flex flex-rows space-x-2 w-full'
                            >
                                <h1>{alternative}</h1>
                            </button>
                            <div className='flex flex-rows place-items-start gap-1'>
                                <h1 className='text-superlight float-right'>{`${isCorrect ? '(correct)' : '(wrong)'}`}</h1>
                                {isCorrect ? 
                                    <button className='text-xl text-superlight hover:text-red-500' onClick={() => removeCorrect(index)}>
                                        ☒
                                    </button> 
                                :
                                    <button className='text-xl text-superlight hover:text-green-500' onClick={() => addCorrect(index)}>
                                        ☑
                                    </button>    
                                }
                                <button className='w-[20px]' onClick={() => removeAlternative(index)}>
                                    <Trash2 className='w-full h-full pt-[3.5px] text-superlight hover:text-red-500' />
                                </button>
                            </div>
                        </div>
                    )    
                })}
            </div>
            <Alternative
                card={card}
                setCard={setCard}
                alternativeIndex={alternativeIndex}
                setAlternativeIndex={setAlternativeIndex}
            />
            <button 
                className='w-full h-[4vh] text-lg place-self-center bg-login rounded-xl mt-2'
                onClick={handleSubmit}
            >Add card</button>
        </div>
    )
}

function Alternative({card, setCard, alternativeIndex, setAlternativeIndex}: AlternativeProps) {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    // Updates the alternative in the course object
    function handleInput(input: string) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives[alternativeIndex] = input
        setCard({...card, alternatives: tempAlternatives})
        autoResizeTextarea(inputRef.current as HTMLTextAreaElement)
    }

    // Adds a new alternative to the current card
    function handleAddAlternative() {
        // Aborts if the current alternative is empty
        if (!card.alternatives[alternativeIndex]) {
            return
        }

        // Max 10 alternatives
        if (alternativeIndex >= 9) {
            return
        }

        card.alternatives.push('')
        setAlternativeIndex(alternativeIndex + 1)
    }

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    return (
        <div className='max-w-full mt-2'>
            <div className='grid grid-cols-12 mb-2'>
                <h1 className='flex items-center justify-start text-lg h-[4vh]'>{alternativeIndex + 1}:</h1>
                <div className='w-full col-span-11 h-full'>
                    <textarea
                        ref={inputRef}
                        value={card.alternatives[alternativeIndex]} 
                        onChange={(event) => handleInput(event.target.value)}
                        placeholder={`Alternative ${alternativeIndex + 1}`}
                        className='min-h-[5vh] w-full bg-light rounded-xl px-2 outline-hidden overflow-hidden resize-none whitespace-pre-wrap caret-orange-500'
                    />
                </div>
            </div>
            {alternativeIndex < 9 && <button 
                className='w-full h-[4vh] bg-login rounded-lg text-xl'
                onClick={handleAddAlternative}
            >Add alternative</button>}
        </div>
    )
}

function Accepted({card: editCard, accepted, setAccepted, handleAcceptedIndexClick}: AcceptedProps) {
    
    function handleRemove(index: number) {
        const tempAccepted = [...accepted]
        tempAccepted.splice(index, 1)
        setAccepted(tempAccepted)
    }
    
    return (
        <div className='w-full h-full bg-darker rounded-xl p-2 overflow-auto noscroll'>
            <div className='grid grid-cols-12'>
                <h1 className='text-xl mb-2 grid grid-row col-span-11'>Accepted</h1>
                <h1 className='text-almostbright'>({accepted.length})</h1>
            </div>
            <div>
                {accepted.map((card: Card, index: number) => {
                    const outline = editCard.question === accepted[index].question
                        ? 'outline-gray-500' : 'outline-hidden'

                    return (
                        <div key={index} className='grid grid-cols-12 gap-2'>
                            <button
                                key={card.question}
                                onClick={() => handleAcceptedIndexClick(index)} 
                                className={`w-full outline ${outline} hover:outline-white bg-light rounded-xl p-2 flex flex-rows space-x-2 mb-2 col-span-11 text-left`}
                            >
                                <div className='grid grid-cols-12 w-full'>
                                    <h1 className='w-full text-almostbright'>{index + 1}</h1>
                                    <h1 className='w-full col-span-10'>{card.question.slice(0, 60)}{card.question.length > 60 && '...'}</h1>
                                    <h1 className='text-almostbright text-right w-full'>{card.alternatives.length}</h1>
                                </div>
                            </button>
                            <button className='flex justify-center align-items mt-auto mb-auto pb-2 w-[1.5vw]' onClick={() => handleRemove(index)}>
                                <Trash2 className='w-full h-full place-self-center text-bright hover:text-red-500' />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Header({ clearCard, editing, setEditing, text, setText, hideText }: HeaderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
  
    async function upload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (file) {
            try {
                const fileReader = new FileReader()

                fileReader.onload = async (event) => {
                    const arrayBuffer = event.target?.result

                    if (arrayBuffer) {
                        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer)
                        // @ts-expect-error
                        // Expecting error here since pdfjsLib is not defined but imported at runtime
                        const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
                        const pdf = await loadingTask.promise
                        let pdfText = ''
                        
                        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                            const page = await pdf.getPage(pageNum)
                            const textContent = await page.getTextContent()
                            const pageText = textContent.items.map((item: any) => item.str).join('\n')
                            pdfText += pageText
                        }

                        setEditing({...editing, texts: [...text, pdfText]})
                        setText([...text, '\n\n', pdfText].join(''))

                        if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                        }
                    }
                }
    
                fileReader.onerror = (error) => {
                    console.error('Error reading file:', error)
                }
    
                fileReader.readAsArrayBuffer(file)
            } catch (error) {
                console.error('Error loading PDF:', error)
            }
        }
    }
  
    return (
      <div className='w-full p-2 flex flex-rows justify-between'>
            <Script src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js' />
            <h1 className='text-xl'>Editing course</h1>
            <div className='space-x-2'>
                <button className='bg-light rounded-lg p-1 px-2' onClick={hideText}>
                    Hide input area
                </button>
                <>
                    <input
                        type='file'
                        accept='.pdf'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={upload}
                    />
                    <button
                        className='bg-light rounded-lg p-1 px-2'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Upload exam
                    </button>
                </>
                <button className='bg-light rounded-lg p-1 px-2' onClick={clearCard}>
                    Clear
                </button>
            </div>
      </div>
    )
}
