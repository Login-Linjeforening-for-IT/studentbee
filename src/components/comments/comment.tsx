import Link from "next/link"
import { Markdown } from "../editor/editor"
import ThumbsUp from "../svg/thumbsup"
import ThumbsDown from "../svg/thumbsdown"
import voteColor from "./voteColor"
import Reply, { Replies } from "./reply"
import Trash from "../svg/trash"
import { Dispatch, SetStateAction } from "react"

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
    return (
        <div key={comment.id}>
            <div className="bg-normal rounded-xl p-4 mt-4 w-full">
                <div className="w-full grid grid-cols-2 text-bright mb-2">
                    <Link href={`/profile/${comment.username}`} className="text-lg text-bright underline">{comment.username}</Link>
                    <h1 className="text-right">{new Date(comment.time).toLocaleString()}</h1>
                </div>
                <Markdown
                    displayEditor={false} 
                    handleDisplayEditor={() => {}} 
                    markdown={comment.content} 
                />
            </div>
            <div className="w-full flex flex-rows space-x-2 mt-1">
                <h1 className="text-bright">{comment.rating > 0 ? '+' : ''}{comment.rating}</h1>
                <button className="w-[1.3vw]" onClick={() => vote({commentID: comment.id, vote: true})}>
                    <ThumbsUp fill={voteColor(comment, 'up')} className="w-full h-full pt-[0.2vh]" />
                </button>
                <button className="w-[1.3vw]" onClick={() => vote({commentID: comment.id, vote: false})}>
                    <ThumbsDown fill={voteColor(comment, 'down')} className="w-full h-full pt-[0.2vh]" />
                </button>
                {user.id === comment.userID && <button 
                    className="text-bright underline w-[1.4vw]" 
                    onClick={() => handleDelete({commentID: comment.id})}
                >
                    <Trash fill="fill-bright hover:fill-red-500" className="w-full h-full pt-[0.2vh]" />
                </button>}
                <button 
                    className="text-bright underline" 
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