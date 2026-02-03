import { Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

type CardsProps = {
    card: Card,
    cards: Card[],
    setEditing: Dispatch<SetStateAction<Course>>
    handleClick: (index: number) => void
}

export default function Cards({ card: editCard, cards, setEditing, handleClick }: CardsProps) {

    function handleRemove(index: number) {
        const updatedCards = [...cards]
        updatedCards.splice(index, 1)
        setEditing(prev => ({ ...prev, cards: updatedCards }))
    }

    return (
        <div className='w-full h-full bg-login-900 rounded-lg p-4 flex flex-col'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-xl font-bold text-white'>Cards</h1>
                <span className='bg-login-800 text-login-300 px-2 py-1 rounded-full text-sm'>{cards.length}</span>
            </div>
            <div className='flex-1 overflow-auto noscroll space-y-2'>
                {cards.map((card: Card, index: number) => {
                    const isSelected = editCard === cards[index]

                    return (
                        <div
                            key={index}
                            className={`
                                group relative flex items-center p-3 rounded-lg cursor-pointer transition-all
                                ${isSelected ? 'bg-login-800 border border-login' : 'bg-login-800 border border-transparent hover:border-login-600'}
                            `}
                            onClick={() => handleClick(index)}
                        >
                            <div className='flex flex-col w-full gap-1 pr-8'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-login font-mono text-sm font-bold'>
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className='text-xs text-login-400'>
                                        {card.alternatives.length} alternatives
                                    </span>
                                </div>
                                <p className='text-sm text-login-200 line-clamp-2'>
                                    {card.question || 'No question text'}
                                </p>
                            </div>

                            <button
                                className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-login-400 hover:text-red-500 hover:bg-login-700 rounded-lg transition-all'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemove(index)
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
