import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, ThumbsDown, ThumbsUp } from 'lucide-react'
import voteColor from '../comments/voteColor'
import { getCookie } from 'uibee/utils'

type QuestionFooterProps = {
    card: Card
    clientVote: 1 | 0 | -1
    handleVote: (vote: boolean) => void
    showComments: boolean
    setShowComments: Dispatch<SetStateAction<boolean>>
    comments: CardComment[]
    showAnswers: () => void
    remainGreen: number[]
}

export default function QuestionFooter({
    card,
    clientVote,
    handleVote,
    showComments,
    setShowComments,
    comments,
    showAnswers,
    remainGreen
}: QuestionFooterProps) {
    const [username, setUsername] = useState('')

    useEffect(() => {
        const user = getCookie('user_nickname') as string | null
        const username = user || ''
        setUsername(username)
    }, [])

    const showAnswer = card.answers.every(answer => remainGreen.includes(answer))
    const revealText = showAnswer
        ? 'Hide'
        : 'Reveal'

    return (
        <div className='grid grid-cols-3'>
            <div className='flex flex-rows space-x-2 mb-2'>
                <h1 className='text-login-300'>
                    {card.rating + clientVote > 0 ? '+' : ''}
                    {card.rating + clientVote}
                </h1>
                <button className='w-[2.3vh] cursor-pointer' onClick={() => handleVote(true)}>
                    <ThumbsUp
                        className={`w-full h-full pt-[0.2vh] ${voteColor('up', card.votes, username, clientVote)}`}
                    />
                </button>
                <button className='w-[2.3vh] cursor-pointer' onClick={() => handleVote(false)}>
                    <ThumbsDown
                        className={`w-full h-full pt-[0.2vh] ${voteColor('down', card.votes, username, clientVote)}`}
                    />
                </button>
            </div>
            <button
                className='pb-2 text-login-300 flex items-center justify-center w-full'
                onClick={() => setShowComments(!showComments)}
            >
                <h1 className='hidden xs:hidden sm:block mr-2'>
                    {comments.length
                        ? `View comments (${comments.length})`
                        : 'Add comment'
                    }
                </h1>
                <h1 className='hidden xs:block sm:hidden mr-2'>
                    {comments.length
                        ? `Chat (${comments.length})`
                        : 'Comment'
                    }
                </h1>
                {showComments ? <ChevronDown /> : <ChevronUp />}
            </button>
            <div>
                <button
                    className='w-full text-end text-login-300'
                    onClick={showAnswers}
                >
                    {revealText}
                </button>
            </div>
        </div>
    )
}
