import config from '@config'
import { getCookie } from 'uibee/utils'

type VoteProps = {
    courseId: string
    cardId: number
    commentId: number
    vote: boolean
}

export async function sendVote({ courseId, cardId, commentId, vote }: VoteProps) {
    try {
        const username = getCookie('user_nickname')
        const token = getCookie('access_token')

        if (!username) {
            throw Error('You must be logged in to vote')
        }

        const response = await fetch(`${config.url.API}/vote/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                courseId,
                cardId,
                commentId,
                vote
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
