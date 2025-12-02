import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Defines the PostFileProps type, used for type specification when posting files
 */
type PostFileProps = {
    courseId?: string
    name?: string
    content?: string
    parent?: string
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export default async function postFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseId, name, content, parent } = req.body as PostFileProps ?? {}
        if (!courseId || !name) {
            return res.status(400).send({ error: 'Missing required field (courseId, name)' })
        }

        const result = await run(`
            INSERT INTO files (course_id, name, content, parent)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name;
        `, [courseId, name, content || '', parent || null])

        return res.status(201).send({ id: result.rows[0].id, name: result.rows[0].name })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
