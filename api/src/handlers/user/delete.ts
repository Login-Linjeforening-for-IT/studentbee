import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

export default async function deleteUser(req: FastifyRequest, res: FastifyReply) {
    try {
        const userId = req.user!.id

        // Delete the user; foreign keys will SET NULL automatically
        const result = await db('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [userId])

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).send({ id: result.rows[0].user_id })
    } catch (error) {
        console.error('Error deleting user:', error)
        return res.status(500).send({ error: (error as Error).message })
    }
}
