import { API } from "@parent/constants"
import getItem from "./localStorage"

type VoteProps = {
    courseID: string
    cardID: number
    commentID: number
    vote: boolean
}

type CardVoteProps = {
    courseID: string
    cardID: number
    vote: boolean
}

export default async function sendCardVote({courseID, cardID, vote}: CardVoteProps) {
    try {
        const user = getItem('user') as User

        if (!user) {
            throw Error('You must be logged in to vote')
        }

        const response = await fetch(`${API}/vote/card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                courseID,
                cardID,
                vote
            })
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        return await response.json()
    } catch (error: unknown) {
        const err = error as Error
        console.error(err.message)
    }
}

export async function sendVote({courseID, cardID, commentID, vote}: VoteProps) {
    try {
        const user = getItem('user') as User

        if (!user) {
            throw Error('You must be logged in to vote')
        }

        const response = await fetch(`${API}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                courseID,
                cardID,
                commentID,
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