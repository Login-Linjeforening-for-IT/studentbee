import { deleteComment, postComment } from '@utils/comments'
import { sendVote } from '@parent/src/utils/vote'
import { useState } from 'react'
import Editor from '../editor/editor'
import Comment from '../comments/comment'
import { getCookie } from 'uibee/utils'

type CommentsProps = {
    comments: CardComment[]
    courseId: string
    cardId: number
}

type VoteProps = {
    commentId: number
    vote: boolean
    isReply?: boolean
}

export default function Comments({ comments, courseId, cardId }: CommentsProps) {
    const [content, setContent] = useState('')
    const [parent, setParent] = useState<number | undefined>()
    const [clientComments, setClientComments] = useState(comments)
    const [voted, setVoted] = useState<ClientVote[]>([])
    const user = getCookie('user_nickname')
    const username = getCookie('user_name') || ''

    function sendComment() {
        if (!content.length) {
            return
        }

        postComment({
            courseId,
            cardId,
            content,
            parent
        })

        clientComments.push({
            id: Date.now(),
            cardId,
            parentId: parent || null,
            userId: 0,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
            rating: 0,
            username,
            votes: []
        })

        setContent('')
    }

    function handleDelete({ commentId }: { commentId: number }) {
        const updatedComments = clientComments.filter(comment => comment.id !== commentId)
        setClientComments(updatedComments)
        deleteComment(commentId)
    }

    function vote({ commentId, vote, isReply }: VoteProps) {
        const foundVote = voted.find(vote => vote.commentId === commentId)

        if (foundVote && !isReply) {
            if (foundVote.vote === vote) {
                const temp = [...clientComments]
                const index = temp.findIndex(comment => comment.id === commentId)
                temp[index] = {
                    ...temp[index],
                    rating: vote ? temp[index].rating - 1 : temp[index].rating + 1
                }

                setClientComments(temp)
                setVoted(voted.filter(vote => vote.commentId !== commentId))
                return
            }

            const temp = [...clientComments]
            const index = temp.findIndex(comment => comment.id === commentId)
            temp[index] = {
                ...temp[index],
                rating: vote ? temp[index].rating + 2 : temp[index].rating - 2
            }

            setClientComments(temp)
            setVoted(voted.map(inner => inner.commentId === commentId ? { commentId, vote } : inner))
            return
        }

        sendVote({ courseId, cardId, commentId, vote })

        if (!isReply) {
            const temp = [...clientComments]
            const index = temp.findIndex(comment => comment.id === commentId)
            temp[index] = {
                ...temp[index],
                rating: vote ? temp[index].rating + 1 : temp[index].rating - 1
            }
            setClientComments(temp)
            setVoted([...voted, { commentId, vote }])
        }
    }

    return (
        <div className='w-full h-full bg-login-900 absolute left-0 top-[100vh] grid grid-cols-10 p-8'>
            {/* not sure what to use this space for */}
            <div className='col-span-2' />
            <div className='w-full col-span-6 overflow-auto noscroll px-1'>
                <h1 className='text-xl mb-2'>Comments ({comments.length})</h1>
                <div className='w-full'>
                    {clientComments.map(comment => <Comment
                        key={comment.id}
                        comment={comment}
                        user={user}
                        vote={vote}
                        parent={parent}
                        setParent={setParent}
                        courseId={courseId}
                        cardId={cardId}
                        clientComments={clientComments}
                        setClientComments={setClientComments}
                        comments={clientComments}
                        handleDelete={handleDelete}
                    />)}
                </div>
                <Editor
                    placeholder='Write a comment...'
                    className='w-full bg-login-700 p-2 rounded-lg min-h-[15vh] max-h-[80vh] mb-2 overflow-auto noscroll'
                    courseId=''
                    value={content.split('\n')}
                    customSaveLogic={true}
                    hideSaveButton={true}
                    save={() => { }}
                    onChange={setContent}
                />
                <button className='h-8 bg-login-700 px-2 rounded-lg float-right cursor-pointer' onClick={sendComment}>
                    Post comment
                </button>
            </div>
            {/* not sure what to use this space for */}
            <div className='col-span-2' />
        </div>
    )
}
