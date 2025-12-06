import Editor from '@components/editor/editor'
import { Trash2, CheckSquare, Square } from 'lucide-react'
import { Dispatch, SetStateAction, useRef } from 'react'
import Alternative from './alternative'

type AddCardProps = {
    courseId: string
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    addCard: () => void
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
    isEditing?: boolean
    isSaved?: boolean
    isEmpty?: boolean
}

export default function AddCard({
    courseId,
    card,
    setCard,
    addCard,
    alternativeIndex,
    setAlternativeIndex,
    isEditing,
    isSaved,
    isEmpty
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
        <div className='w-full h-full overflow-auto noscroll px-2 flex flex-col gap-4'>
            <div className='flex gap-4'>
                <div className='w-1/2'>
                    <h1 className='text-sm text-login-300 mb-1'>Source</h1>
                    <input
                        className='bg-login-800 p-2 w-full rounded-lg outline-hidden caret-login text-white border border-login-700 focus:border-login transition-colors'
                        value={card.source || ''}
                        type='text'
                        placeholder='Exam or learning material source'
                        onChange={(event) => updateSource(event.target.value)}
                    />
                </div>
                <div className='w-1/2'>
                    <h1 className='text-sm text-login-300 mb-1'>Theme</h1>
                    <input
                        ref={inputRef}
                        className='bg-login-800 p-2 w-full rounded-lg outline-hidden caret-login text-white border border-login-700 focus:border-login transition-colors'
                        value={card.theme || ''}
                        type='text'
                        placeholder='Question theme (optional)'
                        onChange={(event) => updateTheme(event.target.value)}
                    />
                </div>
            </div>

            <div>
                <h1 className='text-sm text-login-300 mb-1'>Question</h1>
                <div className='bg-login-800 rounded-lg p-2 border border-login-700'>
                    <Editor
                        placeholder='Enter question...'
                        courseId={courseId}
                        value={card.question.split('\n')}
                        customSaveLogic={true}
                        save={() => { }}
                        onChange={updateQuestion}
                        hideSaveButton={true}
                        forceEditMode={true}
                    />
                </div>
            </div>

            <div>
                <h1 className='text-sm text-login-300 mb-1'>Alternatives</h1>
                <div className='flex flex-col gap-2'>
                    {card.alternatives.map((alternative, index) => {
                        const isCorrect = typeof card.answers === 'number' ? card.answers === index : card.answers.includes(index)

                        if (index == card.alternatives.length - 1 && !alternative) {
                            return null
                        }

                        return (
                            <div key={index} className='flex items-center gap-2 bg-login-800 p-2 rounded-lg border border-login-700 group hover:border-login-600 transition-colors'>
                                <span className='text-login-400 w-6 text-center'>{index + 1}</span>
                                <button
                                    onClick={() => handleAlternativeClick(index)}
                                    className='flex-1 text-left text-white truncate'
                                >
                                    {alternative}
                                </button>
                                <div className='flex items-center gap-2'>
                                    {isCorrect ?
                                        <button
                                            className='text-green-500 hover:text-green-400 transition-colors'
                                            onClick={() => removeCorrect(index)}
                                        >
                                            <CheckSquare size={20} />
                                        </button>
                                        :
                                        <button
                                            className='text-login-400 hover:text-login-300 transition-colors'
                                            onClick={() => addCorrect(index)}
                                        >
                                            <Square size={20} />
                                        </button>
                                    }
                                    <button
                                        className='text-login-400 hover:text-red-500 transition-colors'
                                        onClick={() => removeAlternative(index)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    <div className='bg-login-800 p-2 rounded-lg border border-login-700 border-dashed'>
                        <Alternative
                            card={card}
                            setCard={setCard}
                            alternativeIndex={alternativeIndex}
                            setAlternativeIndex={setAlternativeIndex}
                        />
                    </div>
                </div>
            </div>

            <button
                className={(isSaved || isEmpty || !card.question) ? 'w-full py-3 text-white font-bold rounded-lg transition-colors mt-4 bg-login-700 hover:bg-login-700/90' : 'w-full py-3 text-white font-bold rounded-lg transition-colors mt-4 bg-login hover:bg-login/80'}
                onClick={handleSubmit}
            >
                {isEditing ? 'Update Card' : 'Add Card'}
            </button>
        </div>
    )
}
