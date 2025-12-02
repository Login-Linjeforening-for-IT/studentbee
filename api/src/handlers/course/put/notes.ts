import run from '#db'
import type { FastifyReply, FastifyRequest } from 'fastify'

type PutCourseNotesBody = {
    notes: string
}

/**
 * Updates course notes for the given course
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export default async function putCourseNotes(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id } = req.params as { id: string }
        const { notes } = req.body as PutCourseNotesBody ?? {}

        if (!id) {
            return res.status(400).send({ error: 'Missing id in query' })
        }

        if (!req.user?.id || !notes) {
            return res.status(400).send({ error: 'Missing required field (user ID, notes)' })
        }

        const result = await run(`
            UPDATE courses
            SET notes = $1,
                updated_by = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING id;
        `, [notes, req.user.id, id])
        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'Course not found' })
        }

        return res.send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
