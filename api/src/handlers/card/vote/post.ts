import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Used for type specification when posting card votes
 */
type PostCardVoteProps = {
    courseID: string
    username: string
    cardID: number
    vote: boolean
}

/**
 * Upvotes or downvotes the passed card
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */

export default async function postCardVote(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { username, cardID, vote } = req.body as PostCardVoteProps ?? {}
        if (!username || typeof cardID !== 'number' || vote == null) {
            return res.status(400).send({ error: 'Missing required field (username, cardID, vote)' })
        }

        const card = await run('SELECT id FROM cards WHERE id = $1', [cardID])
        if (card.rowCount === 0) {
            return res.status(404).send({ error: 'Card not found' })
        }

        await run(`
            INSERT INTO card_votes (card_id, user_id, is_upvote, voted_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (card_id, user_id)
            DO UPDATE SET is_upvote = $3, voted_at = NOW();
        `, [cardID, username, vote])

        const ratingResult = await run(`
            SELECT
                SUM(CASE WHEN is_upvote THEN 1 ELSE -1 END) AS rating
            FROM card_votes
            WHERE card_id = $1
        `, [cardID])

        const rating = ratingResult.rows[0].rating ?? 0
        return res.status(200).send({ cardID, rating })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
