import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

/**
 *  Defines the DeleteCommentProps type, used for type specification when deleting comments
 */
type DeleteCommentProps = {
    courseID: string
    username: string
    commentID: number
}

/**
 * Function used to delete comments from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code bsaed on the outcome of the operation
 */
export default async function deleteComment(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { username, commentID } = req.body as DeleteCommentProps ?? {}
        if (!username || typeof commentID !== 'number') {
            return res.status(400).send({ error: 'Missing required field (username, commentID)' })
        }

        const result = await run(
            `DELETE FROM comments
             WHERE id = $1 AND user_id = $2
             RETURNING id;`,
            [commentID, username]
        )

        if (result.rowCount === 0) {
            return res.status(403).send({ error: 'You are not allowed to delete this comment' })
        }

        res.status(200).send({ id: result.rows[0].id })
    } catch (err) {
        res.status(500).send({ error: (err as Error).message })
    }
}
