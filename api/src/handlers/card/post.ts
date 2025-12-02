import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Uploads the given cards to storage as a struct (a unreviewed card struct directly)
 * username: string
 * token: string (user token)
 *
 * courseId: number (the course the unreviewed question is for)
 * {
 *     question: string
 *     alternatives: string[]
 *     correct: number[]
 * }
 *
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export default async function postCard(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseId, question, alternatives, correct } = req.body as {
            courseId: number
            question: string
            alternatives: string[]
            correct: number[]
        } ?? {}

        if (!req.user?.id || !courseId || !question || !alternatives || correct === undefined) {
            return res.status(400).send({ error: 'Missing required fields' })
        }

        const result = await run(`
            INSERT INTO cards (course_id, question, alternatives, answers, created_by, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id
        `, [courseId, question, alternatives, correct, req.user.id])

        return res.status(201).send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
