import { deleteComment, postComment } from '@utils/comments'
import { sendVote } from '@parent/src/utils/vote'
import { useState } from 'react'
import Editor from '../editor/editor'
import Comment from '../comments/comment'
import { getCookie } from 'uibee/utils'

type CommentsProps = {
    comments: CardComment[]
    courseID: string
    cardID: number
    totalCommentsLength: number
}

type VoteProps = {
    commentID: number
    vote: boolean
    isReply?: boolean
}

export default function Comments({comments, courseID, cardID, totalCommentsLength}: CommentsProps) {
    const [content, setContent] = useState('')
    const [parent, setParent] = useState<number | undefined>()
    const [clientComments, setClientComments] = useState(comments)
    const [voted, setVoted] = useState<ClientVote[]>([])
    const user = getCookie('user_nickname')

    function sendComment() {
        if (!content.length) {
            return
        }

        postComment({
            courseID,
            cardID,
            content,
            parent
        })

        clientComments.push({
            id: clientComments.length,
            courseID,
            cardID,
            username: 'You',
            content,
            time: new Date().toISOString(),
            rating: 0,
            votes: []
        })

        setContent('')
    }

    function handleDelete({commentID}: {commentID: number}) {
        const updatedComments = clientComments.filter(comment => comment.id !== commentID)
        setClientComments(updatedComments)
        deleteComment({commentID, courseID})
    }

    function vote({commentID, vote, isReply}: VoteProps) {
        const foundVote = voted.find(vote => vote.commentID === commentID)

        if (foundVote && !isReply) {
            if (foundVote.vote === vote) {
                const temp = [...clientComments]
                const index = temp.findIndex(comment => comment.id === commentID)
                temp[index] = {
                    ...temp[index],
                    rating: vote ? temp[index].rating - 1 : temp[index].rating + 1
                }

                setClientComments(temp)
                setVoted(voted.filter(vote => vote.commentID !== commentID))
                return
            }

            const temp = [...clientComments]
            const index = temp.findIndex(comment => comment.id === commentID)
            temp[index] = {
                ...temp[index],
                rating: vote ? temp[index].rating + 2 : temp[index].rating - 2
            }

            setClientComments(temp)
            setVoted(voted.map(inner => inner.commentID === commentID ? {commentID, vote} : inner))
            return
        }

        sendVote({
            courseID,
            cardID,
            commentID,
            vote
        })

        if (!isReply) {
            const temp = [...clientComments]
            const index = temp.findIndex(comment => comment.id === commentID)
            temp[index] = {
                ...temp[index],
                rating: vote ? temp[index].rating + 1 : temp[index].rating - 1
            }
            setClientComments(temp)
            setVoted([...voted, {commentID, vote}])
        }
    }

    return (
        <div className='w-full h-full bg-login-900 absolute left-0 top-[100vh] grid grid-cols-10 p-8'>
            {/* not sure what to use this space for */}
            <div className='col-span-2' />
            <div className='w-full col-span-6 overflow-auto noscroll px-1'>
                <h1 className='text-xl mb-2'>Comments ({totalCommentsLength})</h1>
                <div className='w-full'>
                    {clientComments.map(comment => <Comment
                        key={comment.id}
                        comment={comment}
                        user={user}
                        vote={vote}
                        parent={parent}
                        setParent={setParent}
                        courseID={courseID}
                        cardID={cardID}
                        clientComments={clientComments}
                        setClientComments={setClientComments}
                        comments={clientComments}
                        handleDelete={handleDelete}
                    />)}
                </div>
                <Editor
                    placeholder='Write a comment...'
                    className='w-full bg-login-700 p-2 rounded-lg min-h-[15vh] max-h-[80vh] mb-2 overflow-auto noscroll'
                    courseID=''
                    value={content.split('\n')}
                    customSaveLogic={true}
                    hideSaveButton={true}
                    save={() => {}}
                    onChange={setContent}
                />
                <button className='h-[5vh] bg-login-700 px-2 rounded-lg float-right' onClick={sendComment}>Post comment</button>
            </div>
            {/* not sure what to use this space for */}
            <div className='col-span-2' />
        </div>
    )
}