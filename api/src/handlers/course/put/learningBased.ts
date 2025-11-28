import run from '#db'
import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Updates the learning status of a course
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export default async function putCourseLearningBased(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseID, learningBased } = req.body as { courseID: string, learningBased: boolean }
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        if (learningBased === undefined || learningBased === null) {
            return res.status(400).send({ error: 'learningBased is required.' })
        }

        const result = await run(`
            UPDATE courses
            SET learning_based = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, learning_based;
        `, [learningBased, courseID])

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'Course not found' })
        }

        return res.status(200).send(result.rows[0])
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
