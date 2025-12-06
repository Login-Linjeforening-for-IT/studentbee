import { Dispatch, SetStateAction } from 'react'
import { ChevronDown, ChevronUp, ThumbsDown, ThumbsUp } from 'lucide-react'
import voteColor from '../comments/voteColor'

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

    const showAnswer = card.answers.every(answer => remainGreen.includes(answer))
    const revealText = showAnswer
        ? 'Hide'
        : 'Reveal'

    return (
        <div className='absolute bottom-0 w-full grid grid-cols-3 px-4'>
            <div className='flex flex-row space-x-2'>
                <h1 className='text-login-300'>
                    {card.rating > 0 ? '+' : ''}
                    {card.rating}
                </h1>
                <button className='size-5 cursor-pointer' onClick={() => handleVote(true)}>
                    <ThumbsUp
                        className={`w-full h-full ${voteColor('up', clientVote)}`}
                    />
                </button>
                <button className='size-5 cursor-pointer' onClick={() => handleVote(false)}>
                    <ThumbsDown
                        className={`w-full h-full ${voteColor('down', clientVote)}`}
                    />
                </button>
            </div>
            <button
                className='text-login-300 flex items-center justify-center w-full h-5 cursor-pointer'
                onClick={() => setShowComments(!showComments)}
            >
                <h1 className='hidden xs:hidden sm:block pr-2'>
                    {comments.length
                        ? `View comments (${comments.length})`
                        : 'Add comment'
                    }
                </h1>
                <h1 className='hidden xs:block sm:hidden pr-2'>
                    {comments.length
                        ? `Chat (${comments.length})`
                        : 'Comment'
                    }
                </h1>
                {showComments ? <ChevronDown /> : <ChevronUp />}
            </button>
            <div>
                <button
                    className='w-full text-end text-login-300 cursor-pointer'
                    onClick={showAnswers}
                >
                    {revealText}
                </button>
            </div>
        </div>
    )
}
