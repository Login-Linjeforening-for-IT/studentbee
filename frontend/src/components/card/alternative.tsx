import { Plus } from 'lucide-react'
import { Dispatch, SetStateAction, useRef, useEffect, useState } from 'react'

type AlternativeProps = {
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

export default function Alternative({ card, setCard, alternativeIndex, setAlternativeIndex }: AlternativeProps) {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const [draft, setDraft] = useState('')
    const isNewPlaceholder = alternativeIndex >= card.alternatives.length || (alternativeIndex === card.alternatives.length - 1 && card.alternatives[alternativeIndex] === '')

    // Updates the alternative in the course object
    function handleInput(input: string) {
        if (isNewPlaceholder) {
            setDraft(input)
        } else {
            const tempAlternatives = [...card.alternatives]
            tempAlternatives[alternativeIndex] = input
            setCard({ ...card, alternatives: tempAlternatives })
        }

        autoResizeTextarea(inputRef.current as HTMLTextAreaElement)
    }

    // Adds a new alternative to the current card
    function handleAddAlternative() {
        if (card.alternatives.length >= 10) {
            return
        }

        if (isNewPlaceholder) {
            if (!draft) return

            const tempAlternatives = [...card.alternatives]
            if (alternativeIndex < tempAlternatives.length) {
                tempAlternatives[alternativeIndex] = draft
            } else {
                tempAlternatives.push(draft)
            }

            if (tempAlternatives.length < 10) {
                tempAlternatives.push('')
            }

            setCard({ ...card, alternatives: tempAlternatives })
            setDraft('')
            setAlternativeIndex(tempAlternatives.length - 1)
            return
        }

        setAlternativeIndex(card.alternatives.length)
    }

    useEffect(() => {
        if (isNewPlaceholder) {
            setDraft('')
        } else {
            setDraft(card.alternatives[alternativeIndex] || '')
        }
    }, [alternativeIndex, card.alternatives, isNewPlaceholder])

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
                <span className='text-login-400 w-6 text-center'>{alternativeIndex + 1}</span>
                <textarea
                    ref={inputRef}
                    value={isNewPlaceholder ? draft : (card.alternatives[alternativeIndex] || '')}
                    onChange={(event) => handleInput(event.target.value)}
                    placeholder={`Enter alternative ${alternativeIndex + 1}...`}
                    className='flex-1 min-h-10 bg-transparent text-white placeholder-login-500 outline-hidden resize-none overflow-hidden py-2'
                    rows={1}
                />
            </div>
            {alternativeIndex < 9 && (
                <button
                    className='flex items-center justify-center gap-2 w-full py-2 text-login-400 hover:text-white hover:bg-login-700 rounded-lg transition-colors text-sm'
                    onClick={handleAddAlternative}
                >
                    <Plus size={16} />
                    Add alternative
                </button>
            )}
        </div>
    )
}
