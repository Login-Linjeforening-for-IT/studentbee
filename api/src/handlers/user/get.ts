import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

export default async function getUser(req: FastifyRequest, res: FastifyReply) {
    try {
        const { id } = req.params as { id: string }
        const user = await db('SELECT * FROM users WHERE user_id = $1', [id])
        return res.status(200).send(user.rows[0])
    } catch (error) {
        console.error(`Error retrieving user: ${error}`)
        return res.status(500).send({ error: (error as Error).message })
    }
}
