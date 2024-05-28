import { deleteComment, postComment, sendVote } from "@/utils/comments"
import getCookie from "@/utils/cookies"
import Image from "next/image"
import Link from "next/link"
import { Dispatch, SetStateAction, use, useState } from "react"

type CommentsProps = {
    comments: CardComment[]
    courseID: string
    cardID: number
    totalCommentsLength: number
}

type ReplyProps = {
    courseID: string
    cardID: number
    comment: CardComment
    comments: CardComment[]
    setComments: Dispatch<SetStateAction<CardComment[]>>
}

type VoteProps = {
    commentID: number
    vote: boolean
    isReply?: true
}

type RepliesProps = {
    replies: CardComment[]
    vote: ({commentID, vote}: VoteProps) => void
    comment: CardComment
    comments: CardComment[]
    setComments: Dispatch<SetStateAction<CardComment[]>>
}

type ReplyComponentProps = {
    reply: CardComment 
    vote: ({commentID, vote}: VoteProps) => void
    comment: CardComment
    comments: CardComment[]
    setComments: Dispatch<SetStateAction<CardComment[]>>
}

type ClientVote = {
    commentID: number
    vote: boolean
}

export default function Comments({comments, courseID, cardID, totalCommentsLength}: CommentsProps) {
    const [content, setContent] = useState("")
    const [parent, setParent] = useState<number | undefined>()
    const [clientComments, setClientComments] = useState(comments)
    const [voted, setVoted] = useState<ClientVote[]>([])
    const user = getCookie('user') as User

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
            id: comments.length,
            courseID,
            cardID,
            userID: user.id || 0,
            username: "You",
            content,
            time: new Date().toISOString(),
            rating: 0,
            votes: []
        })

        setContent("")
    }

    function handleDelete({commentID}: {commentID: number}) {
        const updatedComments = clientComments.filter(comment => comment.id !== commentID)
        setClientComments(updatedComments)
        deleteComment({commentID})
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

            // set the vote to the opposite
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
        <div className="w-full h-full bg-dark absolute left-0 mt-[86vh] grid grid-cols-10 p-8">
            {/* not sure what to use this space for */}
            <div className="col-span-2" />
            <div className="w-full col-span-6 overflow-auto noscroll px-1">
                <h1 className="text-2xl mb-2">Comments ({totalCommentsLength})</h1>
                <div className="mb-2 w-full">
                    {clientComments.map(comment => (
                        <div key={comment.id}>
                            <div className="bg-normal rounded-xl p-4 mt-4 w-full">
                                <div className="w-full grid grid-cols-2 text-bright mb-2">
                                    <Link href={`/profile/${comment.username}`} className="text-lg text-bright underline">{comment.username}</Link>
                                    <h1 className="text-right">{new Date(comment.time).toLocaleString()}</h1>
                                </div>
                                <p className="text-md">{comment.content}</p>
                            </div>
                            <div className="w-full flex flex-rows space-x-2 mt-1">
                                <h1 className="text-bright">{comment.rating > 0 ? '+' : ''}{comment.rating}</h1>
                                <button onClick={() => vote({commentID: comment.id, vote: true})}>
                                    <Image src="/images/thumbsup.svg" alt="logo" height={20} width={20} />
                                </button>
                                <button onClick={() => vote({commentID: comment.id, vote: false})}>
                                    <Image src="/images/thumbsdown.svg" alt="logo" height={20} width={20} />
                                </button>
                                {user.id === comment.userID && <button className="text-bright underline" onClick={() => handleDelete({commentID: comment.id})}>
                                    <Image className="" src="/images/trash.svg" alt="logo" height={19} width={19} />    
                                </button>}
                                <button className="text-bright underline" onClick={() => setParent(parent ? undefined : comment.id)}>Reply</button>
                            </div>
                            {parent === comment.id && <Reply 
                                courseID={courseID} 
                                cardID={cardID} 
                                comment={comment}
                                comments={clientComments}
                                setComments={setClientComments} 
                            />}
                            {comment.replies && <Replies replies={comment.replies} vote={vote} comment={comment} comments={comments} setComments={setClientComments} />}
                        </div>
                    ))}
                </div>
                <textarea 
                    className="w-full h-[20vh] bg-light p-2 rounded-xl min-h-[15vh] max-h-[60vh]" 
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Write a comment..."
                />
                <button className="h-[5vh] bg-light px-2 rounded-xl h-[5vh] float-right" onClick={sendComment}>Post comment</button>
            </div>
            {/* not sure what to use this space for */}
            <div className="col-span-2" />
        </div>
    )
}

function Reply({courseID, cardID, comment, comments, setComments}: ReplyProps) {
    const user = getCookie('user') as User
    const [reply, setReply] = useState("")

    function send() {
        if (!reply.length) {
            return
        }

        postComment({
            courseID,
            cardID,
            content: reply,
            parent: comment.id
        })

        const temp = [...comments]
        const index = temp.indexOf(comment)
        temp[index] = {
            ...comment,
            replies: comment.replies ? [...comment.replies, {
                id: comment.replies.length,
                courseID,
                cardID,
                userID: user.id || 0,
                username: "You",
                content: reply,
                time: new Date().toISOString(),
                rating: 0,
                votes: []
            }] : [{
                id: 0,
                courseID,
                cardID,
                userID: user.id || 0,
                username: "You",
                content: reply,
                time: new Date().toISOString(),
                rating: 0,
                votes: []
            }]
        }
        setComments(temp)

        setReply('')
    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-span-2" />
            <textarea 
                value={reply}
                className="w-full h-[7.5vh] bg-light p-2 rounded-xl min-h-[7.5vh] max-h-[15vh] col-span-8" 
                placeholder="Write a comment..."
                onChange={(event) => setReply(event.target.value)}
            />
            <button className="col-span-2 justify-start" onClick={send}>Add comment</button>
        </div>
    )
}

function Replies({replies, vote, comment, comments, setComments}: RepliesProps) {
    return (
        <div className="grid grid-cols-12 mt-2">
            <div className="col-span-1" />
            <div className="col-span-11">
                {replies.map((reply) => <ReplyComponent 
                    key={reply.id}
                    reply={reply} 
                    vote={vote} 
                    comment={comment} 
                    comments={comments} 
                    setComments={setComments} 
                />)}
            </div>
        </div>
    )
}

function ReplyComponent({reply, vote, comment, comments, setComments}: ReplyComponentProps) {
    const [clientVote, setClientVote] = useState<1 | 0 | -1>(0)
    const user = getCookie('user') as User

    function handleDelete() {
        deleteComment({commentID: reply.id})

        const temp = [...comments]
        const index = temp.indexOf(comment)
        temp[index] = {
            ...comment,
            replies: comment.replies?.filter(inner => inner.id !== reply.id)
        }
        setComments(temp)
    }

    function handleVote({current}: {commentID: number, current: boolean}) {
        if (clientVote === 1 && current || clientVote === -1 && !current) {
            setClientVote(0)
        } else {
            setClientVote(current ? 1 : -1)
        }

        vote({commentID: reply.id, vote: current, isReply: true})
    }

    return (
        <div>
            <div className="bg-normal rounded-xl p-2 mb-1">
                <div className="w-full grid grid-cols-2 text-bright">
                    <Link href={`/profile/${reply.username}`} className="text-lg text-bright underline">{reply.username}</Link>
                    <h1 className="text-right pr-2">{new Date(reply.time).toLocaleString()}</h1>
                </div>
                <p className="text-md">{reply.content}</p>
            </div>
            <div className="w-full flex flex-rows space-x-2 mb-4">
                <h1 className="text-bright">{reply.rating > 0 ? '+' : ''}{reply.rating + clientVote}</h1>
                <button onClick={() => handleVote({commentID: reply.id, current: true})}>
                    <Image src="/images/thumbsup.svg" alt="logo" height={20} width={20} />
                </button>
                <button onClick={() => handleVote({commentID: reply.id, current: false})}>
                    <Image src="/images/thumbsdown.svg" alt="logo" height={20} width={20} />
                </button>
                {user.id === reply.userID && <button className="text-bright underline" onClick={handleDelete}>
                    <Image className="" src="/images/trash.svg" alt="logo" height={19} width={19} />    
                </button>}
            </div>
        </div>
    )
}