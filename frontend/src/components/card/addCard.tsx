import Editor from '@components/editor/editor'
import { Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction, useRef } from 'react'
import Alternative from './alternative'

type AddCardProps = {
    courseId: string
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    addCard: () => void
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

export default function AddCard({
    courseId,
    card,
    setCard,
    addCard,
    alternativeIndex,
    setAlternativeIndex
}: AddCardProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    function updateQuestion(question: string) {
        setCard({ ...card, question })
    }

    function updateTheme(theme: string) {
        setCard({ ...card, theme })
    }

    function updateSource(source: string) {
        setCard({ ...card, source })
    }

    function handleAlternativeClick(index: number) {
        setAlternativeIndex(index)
    }

    function removeAlternative(index: number) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives.splice(index, 1)
        setCard({ ...card, alternatives: tempAlternatives })
        setAlternativeIndex(alternativeIndex - 1 > 0 ? alternativeIndex - 1 : 0)
    }

    function handleSubmit() {
        addCard()

        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    function addCorrect(index: number) {
        if (typeof card.answers === 'number') {
            setCard({ ...card, answers: [card.answers, index] })
        } else {
            setCard({ ...card, answers: [...card.answers, index] })
        }
    }

    function removeCorrect(index: number) {
        if (typeof card.answers === 'number') {
            setCard({ ...card, answers: [] })
        } else {
            setCard({ ...card, answers: card.answers.filter((correctIndex) => correctIndex !== index) })
        }
    }

    return (
        <div className='w-full h-full overflow-auto noscroll'>
            <h1 className='flex items-center justify-start text-lg h-[4vh]'>Source</h1>
            <input
                className='bg-login-700 p-1 pl-2 w-full rounded-lg h-[4vh] outline-hidden caret-orange-500'
                value={card.source || ''}
                type='text'
                placeholder='Exam or learning material source'
                onChange={(event) => updateSource(event.target.value)}
            />
            <h1 className='flex items-center justify-start text-lg h-[4vh]'>Theme</h1>
            <input
                ref={inputRef}
                className='bg-login-700 p-1 pl-2 w-full rounded-lg h-[4vh] outline-hidden caret-orange-500'
                value={card.theme || ''}
                type='text'
                placeholder='Question theme (optional)'
                onChange={(event) => updateTheme(event.target.value)}
            />
            <h1 className='flex items-center justify-start text-lg col-span-1 h-[4vh]'>Question</h1>
            <div className='bg-login-700 rounded-lg p-2'>
                <Editor
                    placeholder='Enter question...'
                    courseId={courseId}
                    value={card.question.split('\n')}
                    customSaveLogic={true}
                    save={() => { }}
                    onChange={updateQuestion}
                    hideSaveButton={true}
                />
            </div>
            <h1 className='flex items-center justify-start text-lg col-span-1 h-[4vh]'>Alternatives</h1>
            <div className='w-full'>
                {card.alternatives.map((alternative, index) => {
                    const isCorrect = typeof card.answers === 'number' ? card.answers === index : card.answers.includes(index)

                    if (index == card.alternatives.length - 1 && !alternative) {
                        return null
                    }

                    return (
                        <div key={index} className='flex flex-rows max-w-full w-full'>
                            <h1 className='w-10 text-login-400'>{index + 1}</h1>
                            <button
                                onClick={() => handleAlternativeClick(index)}
                                key={alternative}
                                className='text-left flex flex-rows space-x-2 w-full'
                            >
                                <h1>{alternative}</h1>
                            </button>
                            <div className='flex flex-rows place-items-start gap-1'>
                                <h1 className='text-login-400 float-right'>{`${isCorrect ? '(correct)' : '(wrong)'}`}</h1>
                                {isCorrect ?
                                    <button className='text-xl text-login-400 hover:text-red-500' onClick={() => removeCorrect(index)}>
                                        ☒
                                    </button>
                                    :
                                    <button className='text-xl text-login-400 hover:text-green-500' onClick={() => addCorrect(index)}>
                                        ☑
                                    </button>
                                }
                                <button className='w-5' onClick={() => removeAlternative(index)}>
                                    <Trash2 className='w-full h-full pt-[3.5px] text-login-400 hover:text-red-500' />
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
                className='w-full h-[4vh] text-lg place-self-center bg-login rounded-lg mt-2'
                onClick={handleSubmit}
            >Add card</button>
        </div>
    )
}
