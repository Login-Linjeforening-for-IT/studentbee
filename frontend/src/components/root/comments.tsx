import { deleteComment, postComment, postCommentVote } from '@utils/api'
import { useState, useEffect } from 'react'
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
    const username = getCookie('user_name') || ''

    useEffect(() => {
        setClientComments(comments)
    }, [comments])

    console.log(comments)

    async function sendComment() {
        if (!content.length) {
            return
        }

        try {
            const response = await postComment({
                cardId,
                content,
                parent
            })
            if ('error' in response) {
                console.error('Failed to post comment:', response)
                return
            }
        } catch (error) {
            console.error('Failed to post comment:', error)
            return
        }

        clientComments.push({
            id: Date.now(),
            cardId,
            parentId: parent || null,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
            rating: 0,
            username,
            vote: null
        })

        setContent('')
    }

    async function handleDelete({ commentId }: { commentId: number }) {
        const updatedComments = clientComments.filter(comment => comment.id !== commentId)
        setClientComments(updatedComments)
        try {
            const res = await deleteComment({ id: commentId })
            if ('error' in res) {
                console.error('Failed to delete comment:', res)
            }
        } catch (error) {
            console.error('Failed to delete comment:', error)
        }
    }

    function vote({ commentId, vote }: VoteProps) {
        (async () => {
            try {
                const res = await postCommentVote({ commentId, vote })
                if ('error' in res) {
                    console.error('Failed to send comment vote:', res)
                }
            } catch (err) {
                console.error('Failed to send comment vote:', err)
            }
        })()
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
