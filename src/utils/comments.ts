import { API } from "@parent/constants"
import getCookie from "./cookies"

type CommentProps = {
    courseID: string
    cardID: number
    content: string
    parent?: number
}

export default async function getComments(CourseID: string): Promise<CardComment[][]> {
    const response = await fetch(`${API}/comments/${CourseID}`, {
        next: { revalidate: 10 },
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const data = await response.json()

        throw Error(data.error)
    }

    return await response.json()
}

export async function postComment({courseID, cardID, content, parent}: CommentProps) {
    try {
        const user = getCookie('user') as User

        if (!user) {
            throw Error('You must be logged in to comment')
        }

        const response = await fetch(`${API}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: user.id,
                username: user.username,
                courseID,
                cardID,
                content,
                parent
            })
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function deleteComment({commentID}: {commentID: number}) {
    try {
        const user = getCookie('user') as User

        if (!user) {
            throw Error('You must be logged in to delete a comment')
        }

        const response = await fetch(`${API}/comment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: user.id,
                commentID
            })
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export function getTotalCommentsLength(comments: CardComment[], cardID: number): number {
    let length = comments.reduce((acc, comment) => { 
        acc += comment.cardID === cardID ? 1 : 0; return acc 
    }, 0)
    
    for (const comment of comments) {
        if (comment.replies && comment.replies.length > 0 && comment.cardID === cardID) {
            length += getTotalCommentsLength(comment.replies, cardID)
        }
    }

    return length
}