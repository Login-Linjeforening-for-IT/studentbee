import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

/**
 *  Defines the DeleteCommentProps type, used for type specification when deleting comments
 */
type DeleteCommentProps = {
    courseId: string
    commentId: number
}

/**
 * Function used to delete comments from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code bsaed on the outcome of the operation
 */
export default async function deleteComment(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { commentId } = req.body as DeleteCommentProps ?? {}
        if (!req.user?.id || typeof commentId !== 'number') {
            return res.status(400).send({ error: 'Missing required field (commentId)' })
        }

        const result = await run(
            `DELETE FROM comments
             WHERE id = $1 AND user_id = $2
             RETURNING id;`,
            [commentId, req.user.id]
        )

        if (result.rowCount === 0) {
            return res.status(403).send({ error: 'You are not allowed to delete this comment' })
        }

        return res.status(200).send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
