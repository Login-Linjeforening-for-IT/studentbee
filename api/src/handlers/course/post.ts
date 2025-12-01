import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

type PostCourseProps = {
    id: string
    name: string
}

/**
 * Uploads the given course to storage as a Course object
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export default async function postCourse(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id, name } = req.body as PostCourseProps ?? {}
        const { id: userID } = req.user ?? {}
        if (!id || !name) {
            return res.status(400).send({ error: 'Missing required field (id, name)' })
        }

        const courseResponse = await run('INSERT INTO courses (course_code, name, notes, created_by, updated_by) VALUES ($1, $2, $3, $4, $5) RETURNING id', [id, name, '', userID, userID])
        if (!courseResponse.rowCount) {
            throw new Error('Failed to create course')
        }

        /* await run(`
            INSERT INTO files (course_id, name, content, created_by, updated_by) VALUES ($1, $2, $3, $4, $4) RETURNING id;
        `, [id, name, '', userID, userID]) */

        return res.status(201).send({ id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
