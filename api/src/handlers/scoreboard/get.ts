import { FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db'

export async function getScoreboard(req: FastifyRequest, res: FastifyReply) {
    try {
        const scoreboard = await db(
            'SELECT name, score, total_time FROM users ORDER BY score DESC LIMIT 10'
        )

        return res.status(200).send(scoreboard.rows)
    } catch (error) {
        console.error('Error retrieving scoreboard:', error)
        return res.status(500).send({ error: 'Internal server error' })
    }
}
