import Link from 'next/link'
import { Markdown } from '../editor/editor'
import voteColor from './voteColor'
import Reply, { Replies } from './reply'
import { Dispatch, SetStateAction, useState } from 'react'
import { ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { getCookie } from 'uibee/utils'

type CommentProps = {
    comment: CardComment
    vote: ({ commentId, vote }: ClientVote) => void
    parent?: number
    setParent: Dispatch<SetStateAction<number | undefined>>
    courseId: string
    cardId: number
    clientComments: CardComment[]
    setClientComments: Dispatch<SetStateAction<CardComment[]>>
    comments: CardComment[]
    handleDelete: ({ commentId }: { commentId: number }) => void
}

export default function Comment({
    comment,
    vote,
    parent,
    setParent,
    courseId,
    cardId,
    clientComments,
    setClientComments,
    comments,
    handleDelete
}: CommentProps) {
    const username = getCookie('user_name') || ''
    const [clientVote, setClientVote] = useState<1 | 0 | -1>(0)
    const comment_user = comment.username
    const author = comment_user === username ? 'You' : comment_user

    function handleVote(direction: 'up' | 'down') {
        if (clientVote === (direction === 'up' ? 1 : -1)) {
            setClientVote(0)
        } else {
            setClientVote(direction === 'up' ? 1 : -1)
        }

        vote({ commentId: comment.id, vote: direction === 'up' ? true : false })
    }

    return (
        <div key={comment.id}>
            <div className='bg-login-800 rounded-lg p-2 mt-2 w-full'>
                <div className='w-full grid grid-cols-2 text-login-300 mb-2'>
                    <Link href={`/profile/${comment_user}`} className='text-lg text-login-300 underline'>{author}</Link>
                    <h1 className='text-right'>
                        {new Date(comment.createdAt).toLocaleString([],
                            { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                        )}
                    </h1>
                </div>
                <Markdown
                    displayEditor={false}
                    handleDisplayEditor={() => { }}
                    markdown={comment.content}
                />
            </div>
            <div className='w-full flex flex-rows space-x-2 mt-1'>
                <h1 className='text-login-300'>{comment.rating > 0 ? '+' : ''}{comment.rating}</h1>
                <button className='w-[1.3vw] cursor-pointer' onClick={() => handleVote('up')}>
                    <ThumbsUp className={`w-full h-full pt-[0.2vh] ${voteColor('up', clientVote)}`} />
                </button>
                <button className='w-[1.3vw] cursor-pointer' onClick={() => handleVote('down')}>
                    <ThumbsDown className={`w-full h-full pt-[0.2vh] ${voteColor('down', clientVote)}`} />
                </button>
                {username === comment_user && <button
                    className='text-login-300 underline w-[1.4vw] cursor-pointer'
                    onClick={() => handleDelete({ commentId: comment.id })}
                >
                    <Trash2 className='w-full h-full pt-[0.2vh] text-login-50 hover:text-red-500' />
                </button>}
                <button
                    className='text-login-300 underline cursor-pointer'
                    onClick={() => setParent(parent ? undefined : comment.id)}
                >
                    Reply
                </button>
            </div>
            {parent === comment.id && <Reply
                courseId={courseId}
                cardId={cardId}
                comment={comment}
                comments={clientComments}
                setComments={setClientComments}
            />}
            {comment.replies && <Replies
                replies={comment.replies}
                vote={vote}
                comment={comment}
                comments={comments}
                setComments={setClientComments}
            />}
        </div>
    )
}
