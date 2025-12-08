import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Used for type specification when posting comment votes
 */
type PostCommentVoteProps = {
    commentId: number
    vote: boolean
}

/**
 * Upvotes or downvotes the passed comment
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */

export default async function postCommentVote(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { commentId, vote } = req.body as PostCommentVoteProps ?? {}
        if (!req.user?.id || typeof commentId !== 'number' || vote == null) {
            return res.status(400).send({ error: 'Missing required field (commentId, vote)' })
        }

        const comment = await run('SELECT id FROM comments WHERE id = $1', [commentId])
        if (comment.rowCount === 0) {
            return res.status(404).send({ error: 'Comment not found' })
        }

        await run(`
            INSERT INTO comment_votes (comment_id, user_id, is_upvote, voted_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (comment_id, user_id)
            DO UPDATE SET is_upvote = $3, voted_at = NOW();
        `, [commentId, req.user.id, vote])

        const ratingResult = await run(`
            SELECT
                SUM(CASE WHEN is_upvote THEN 1 ELSE -1 END) AS rating
            FROM comment_votes
            WHERE comment_id = $1
        `, [commentId])

        const rating = ratingResult.rows[0].rating ?? 0
        return res.status(200).send({ commentId, rating })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
