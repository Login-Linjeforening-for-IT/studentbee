import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function getScoreboard(_: FastifyRequest, res: FastifyReply) {
    try {
        const scoreboard = await run(
            'SELECT name, score, time FROM users ORDER BY score DESC LIMIT 10'
        )

        return res.status(200).send(scoreboard.rows)
    } catch (error) {
        console.error('Error retrieving scoreboard:', error)
        return res.status(500).send({ error: 'Internal server error' })
    }
}
