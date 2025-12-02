import { Dispatch, SetStateAction, useRef } from 'react'

type AlternativeProps = {
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

export default function Alternative({ card, setCard, alternativeIndex, setAlternativeIndex }: AlternativeProps) {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    // Updates the alternative in the course object
    function handleInput(input: string) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives[alternativeIndex] = input
        setCard({ ...card, alternatives: tempAlternatives })
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
                        className='min-h-[5vh] w-full bg-login-700 rounded-lg px-2 outline-hidden overflow-hidden resize-none whitespace-pre-wrap caret-orange-500'
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
