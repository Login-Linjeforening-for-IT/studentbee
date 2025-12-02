import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

type PostCourse = {
    courseCode: string
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
        const { courseCode, name } = req.body as PostCourse ?? {}
        const { id: userId } = req.user ?? {}
        if (!courseCode || !name) {
            return res.status(400).send({ error: 'Missing required field (courseCode, name)' })
        }

        const courseResponse = await run(`
            INSERT INTO courses (course_code, name, notes, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [courseCode.toUpperCase(), name, '', userId, userId])

        if (!courseResponse.rowCount) {
            throw new Error('Failed to create course')
        }

        const id = courseResponse.rows[0].id

        await run(`
            INSERT INTO files (name, content, course_id, created_by, updated_by)
            VALUES ('root', '', $1, $2, $2)    
        `, [id, userId])

        return res.status(201).send({ id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
