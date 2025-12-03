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
        <div className='w-full h-full bg-login-900 rounded-lg p-2 overflow-auto noscroll'>
            <div className='grid grid-cols-12'>
                <h1 className='text-xl mb-2 grid grid-row col-span-11'>Cards</h1>
                <h1 className='text-login-300'>({cards.length})</h1>
            </div>
            <div>
                {cards.reverse().map((card: Card, index: number) => {
                    const outline = editCard.question === cards[index].question
                        ? 'outline-gray-500' : 'outline-hidden'

                    return (
                        <div key={index} className='flex group mb-2'>
                            <button
                                key={card.question}
                                onClick={() => handleClick(index)}
                                className={`
                                    flex-1 outline ${outline} 
                                    hover:outline-white bg-login-700 
                                    rounded-lg p-2 flex flex-rows space-x-2
                                    text-left cursor-pointer
                                `}
                            >
                                <div className='grid grid-cols-12 w-full'>
                                    <h1 className='w-full text-login-300'>{index + 1}</h1>
                                    <h1 className='w-full col-span-10'>{card.question.slice(0, 60)}{card.question.length > 60 && '...'}</h1>
                                    <h1 className='text-login-300 text-right w-full'>{card.alternatives.length}</h1>
                                </div>
                            </button>
                            <button className='flex justify-center items-center cursor-pointer w-0 group-hover:w-6 transition-all duration-200' onClick={() => handleRemove(index)}>
                                <Trash2 className='w-full h-full text-login-50 hover:text-red-500' />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
