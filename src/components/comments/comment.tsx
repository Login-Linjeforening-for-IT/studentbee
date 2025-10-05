import Link from 'next/link'
import { Markdown } from '../editor/editor'
import voteColor from './voteColor'
import Reply, { Replies } from './reply'
import { Dispatch, SetStateAction, useState } from 'react'
import { ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'

type CommentProps = {
    comment: CardComment
    user: User
    vote: ({commentID, vote}: ClientVote) => void
    parent?: number
    setParent: Dispatch<SetStateAction<number | undefined>>
    courseID: string
    cardID: number
    clientComments: CardComment[]
    setClientComments: Dispatch<SetStateAction<CardComment[]>>
    comments: CardComment[]
    handleDelete: ({commentID}: {commentID: number}) => void
}

export default function Comment({
    user,
    comment,
    vote,
    parent,
    setParent,
    courseID,
    cardID,
    clientComments,
    setClientComments,
    comments,
    handleDelete
}: CommentProps) {
    const [clientVote, setClientVote] = useState<1 | 0 | -1>(0)
    const comment_user = comment.username.split('@')[0]
    const username = user?.username.split('@')[0]
    const author = comment_user === username ? 'You' : comment_user

    function handleVote(direction: 'up' | 'down') {
        if (clientVote === (direction === 'up' ? 1 : -1)) {
            setClientVote(0)
        } else {
            setClientVote(direction === 'up' ? 1 : -1)
        }

        vote({commentID: comment.id, vote: direction === 'up' ? true : false})
    }

    return (
        <div key={comment.id}>
            <div className='bg-login-800 rounded-xl p-2 mt-2 w-full'>
                <div className='w-full grid grid-cols-2 text-login-300 mb-2'>
                    <Link href={`/profile/${comment_user}`} className='text-lg text-login-300 underline'>{author}</Link>
                    <h1 className='text-right'>{new Date(comment.time).toLocaleString()}</h1>
                </div>
                <Markdown
                    displayEditor={false}
                    handleDisplayEditor={() => {}}
                    markdown={comment.content}
                />
            </div>
            <div className='w-full flex flex-rows space-x-2 mt-1'>
                <h1 className='text-login-300'>{comment.rating > 0 ? '+' : ''}{comment.rating}</h1>
                <button className='w-[1.3vw]' onClick={() => handleVote('up')}>
                    <ThumbsUp className={`w-full h-full pt-[0.2vh] ${voteColor('up', comment.votes, username, clientVote)}`} />
                </button>
                <button className='w-[1.3vw]' onClick={() => handleVote('down')}>
                    <ThumbsDown className={`w-full h-full pt-[0.2vh] ${voteColor('down', comment.votes, username, clientVote)}`} />
                </button>
                {username === comment_user && <button
                    className='text-login-300 underline w-[1.4vw]'
                    onClick={() => handleDelete({commentID: comment.id})}
                >
                    <Trash2 className='w-full h-full pt-[0.2vh] text-login-50 hover:text-red-500' />
                </button>}
                <button
                    className='text-login-300 underline'
                    onClick={() => setParent(parent ? undefined : comment.id)}
                >
                    Reply
                </button>
            </div>
            {parent === comment.id && <Reply
                courseID={courseID}
                cardID={cardID}
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