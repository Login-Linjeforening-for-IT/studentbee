import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    id: string
}

/**
 * Fetches course by id
 * @param req Request
 * @param res Response
 */
export async function courseHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as CourseParam

    try {
        const result = await run('SELECT * FROM courses WHERE course_code = $1', [id])
        if (!result.rowCount) {
            return res.status(404).send({ error: 'Course not found' })
        }

        return res.send(result.rows)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
