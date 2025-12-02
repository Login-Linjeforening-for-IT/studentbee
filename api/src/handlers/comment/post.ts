import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Defines the ReplyProps type, used for type specification when posting replies
 */
type ReplyProps = {
    courseId: string
    cardId: number
    commentId: number
    content: string
    parent?: number
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export default async function postComment(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseId, cardId, content, parent } = req.body as ReplyProps ?? {}

        if (!req.user?.id || !courseId || typeof cardId !== 'number' || !content) {
            return res.status(400).send({
                error: 'Missing required field (courseId, card_id, content)'
            })
        }

        const result = await run(`
            INSERT INTO comments (
                course_id,
                card_id,
                parent_id,
                user_id,
                content
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `, [courseId, cardId, parent ?? null, req.user.id, content])

        return res.status(201).send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
