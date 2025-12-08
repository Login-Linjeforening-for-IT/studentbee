import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

type PutTimeProps = {
    time: number
}

export default async function putUserTime(req: FastifyRequest, res: FastifyReply) {
    try {
        const { time } = req.body as PutTimeProps ?? {}
        if (typeof time !== 'number' || !Number.isInteger(time) || time < 0) {
            return res.status(400).send({ error: 'Invalid time provided' })
        }

        const userId = req.user!.id
        const result = await run(`
            UPDATE users
            SET time = $1, updated_at = NOW()
            WHERE user_id = $2
            RETURNING user_id AS "userId"
        `, [time, userId])

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).send({ id: result.rows[0].userId })
    } catch (error) {
        console.error('Error updating user time:', error)
        return res.status(500).send({ error: (error as Error).message })
    }
}
