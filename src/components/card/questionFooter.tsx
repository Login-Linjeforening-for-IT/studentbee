import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import voteColor from '../comments/voteColor'
import getItem from '@/utils/localStorage'
import { ChevronDown, ChevronUp, ThumbsDown, ThumbsUp } from 'lucide-react'

type QuestionFooterProps = {
    card: Card
    clientVote: 1 | 0 | -1
    handleVote: (vote: boolean) => void
    showComments: boolean
    setShowComments: Dispatch<SetStateAction<boolean>>
    totalCommentsLength: number
    showAnswers: () => void
    remainGreen: number[]
}

export default function QuestionFooter({
    card, 
    clientVote, 
    handleVote,
    showComments, 
    setShowComments, 
    totalCommentsLength, 
    showAnswers, 
    remainGreen
}: QuestionFooterProps) {
    const [username, setUsername] = useState('')

    useEffect(() => {
        const user = getItem('user') as User | string | undefined
        const username = user && typeof user === 'object' ? user.username : ''
        setUsername(username)
    }, []) 

    const showAnswer = card.correct.every(answer => remainGreen.includes(answer))
    const revealText = showAnswer
        ? 'Hide' 
        : 'Reveal'

    return (
        <div className='grid grid-cols-3'>
            <div className='flex flex-rows space-x-2 mb-2'>
                <h1 className='text-almostbright'>
                    {card.rating + clientVote > 0 ? '+' : ''}
                    {card.rating + clientVote}
                </h1>
                <button className='w-[2.3vh]' onClick={() => handleVote(true)}>
                    <ThumbsUp 
                        className={`w-full h-full pt-[0.2vh] ${voteColor('up', card.votes, username, clientVote)}`}
                    />
                </button>
                <button className='w-[2.3vh]' onClick={() => handleVote(false)}>
                    <ThumbsDown 
                        className={`w-full h-full pt-[0.2vh] ${voteColor('down', card.votes, username, clientVote)}`}
                    />
                </button>
            </div>
            <button 
                className='pb-2 text-almostbright flex items-center justify-center w-full' 
                onClick={() => setShowComments(!showComments)}
            >
                <h1 className='hidden xs:hidden sm:block mr-2'>
                    {totalCommentsLength 
                        ? `View comments (${totalCommentsLength})` 
                        : 'Add comment'
                    }
                </h1>
                <h1 className='hidden xs:block sm:hidden mr-2'>
                    {totalCommentsLength 
                        ? `Chat (${totalCommentsLength})` 
                        : 'Comment'
                    }
                </h1>
                {showComments ? <ChevronDown /> : <ChevronUp />}
            </button>
            <div>
                <button 
                    className='w-full text-end text-almostbright' 
                    onClick={showAnswers}
                >
                    {revealText}
                </button>
            </div>
        </div>
    )
}
