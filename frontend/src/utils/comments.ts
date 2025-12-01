import config from '@config'
import { getCookie } from 'uibee/utils'

type CommentProps = {
    courseID: string
    cardID: number
    content: string
    parent?: number
}

export async function postComment({ courseID, cardID, content, parent }: CommentProps) {
    try {
        const username = getCookie('user_nickname')
        const token = getCookie('access_token')

        if (!username) {
            throw Error('You must be logged in to comment')
        }

        const response = await fetch(`${config.url.API}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
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

export async function deleteComment({ commentID, courseID }: { commentID: number, courseID: string }) {
    try {
        const username = getCookie('user_nickname')
        const token = getCookie('access_token')

        if (!username) {
            throw Error('You must be logged in to delete a comment')
        }

        const response = await fetch(`${config.url.API}/comment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                courseID: courseID,
                username: username,
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

export function getTotalCommentsLength(comments: CardCommentProps[], cardID: number): number {
    let length = comments.reduce((acc, comment) => {
        acc += (comment.card_id === cardID || comment.card_id === null) ? 1 : 0; return acc
    }, 0)

    for (const comment of comments) {
        if (comment.replies && comment.replies.length > 0 && (comment.card_id === cardID || comment.card_id === null)) {
            length += getTotalCommentsLength(comment.replies, cardID)
        }
    }

    return length
}
