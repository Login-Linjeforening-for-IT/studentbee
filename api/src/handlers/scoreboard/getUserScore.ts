import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

export default async function getUserScore(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id : string }
    try {
        const scoreboard = await db('SELECT name, score FROM users WHERE id = $1', [id])
        return res.status(200).send(scoreboard.rows)
    } catch (error) {
        console.error('Error retrieving scoreboard:', error)
        return res.status(500).send({ error: 'Internal server error' })
    }
}
