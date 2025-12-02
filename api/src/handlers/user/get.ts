import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function getUser(req: FastifyRequest, res: FastifyReply) {
    try {
        const id = req.user?.id
        const result = await run('SELECT * FROM users WHERE user_id = $1', [id])
        if (!result.rowCount) {
            return res.status(404).send({ error: 'User not found.' })
        }

        return res.status(200).send(result.rows[0])
    } catch (error) {
        console.error(`Error retrieving user: ${error}`)
        return res.status(500).send({ error: (error as Error).message })
    }
}
