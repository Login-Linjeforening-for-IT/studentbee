import config from '@config'
import { getCookie } from 'uibee/utils'

type CommentProps = {
    courseId: string
    cardId: number
    content: string
    parent?: number
}

export async function postComment({ courseId, cardId, content, parent }: CommentProps) {
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
                username,
                courseId,
                cardId,
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

export async function deleteComment(id: number) {
    try {
        const token = getCookie('access_token')
        if (!token) {
            throw Error('You must be logged in to delete a comment')
        }

        const response = await fetch(`${config.url.API}/comment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
