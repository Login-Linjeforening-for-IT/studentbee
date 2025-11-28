import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Defines the PostFileProps type, used for type specification when posting files
 */
type PostFileProps = {
    courseID?: string
    name?: string
    content?: string
    parent?: string
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export async function postFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseID, name, content, parent } = req.body as PostFileProps ?? {}
        if (!courseID || !name) {
            return res.status(400).send({ error: 'Missing required field (courseID, name)' })
        }

        const result = await run(`
            INSERT INTO files (course_id, name, content, parent)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name;
        `, [courseID, name, content || '', parent || null])

        res.status(201).send({ id: result.rows[0].id, name: result.rows[0].name })
    } catch (err) {
        res.status(500).send({ error: (err as Error).message })
    }
}
