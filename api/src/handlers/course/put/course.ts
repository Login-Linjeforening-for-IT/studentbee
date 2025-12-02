import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function putCourse(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id } = req.params as { id: string }
        const { notes } = req.body as { username: string; notes: string } ?? {}

        if (!id) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        if (!req.user?.id || !notes) {
            return res.status(400).send({ error: 'User ID and notes are required.' })
        }

        const result = await run(`
            UPDATE courses
            SET
                notes = $1,
                updated_by = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING id;
        `, [notes, req.user.id, id])

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'Course not found' })
        }

        return res.status(200).send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
