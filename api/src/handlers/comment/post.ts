import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Defines the ReplyProps type, used for type specification when posting replies
 */
type ReplyProps = {
    username: string
    courseID: string
    cardID: number
    commentID: number
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
        const { username, courseID, cardID, content, parent } = req.body as ReplyProps ?? {}

        if (!username || !courseID || typeof cardID !== 'number' || !content) {
            return res.status(400).send({
                error: 'Missing required field (username, courseID, cardID, content)'
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
        `, [courseID, cardID, parent ?? null, username, content])

        return res.status(201).send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
