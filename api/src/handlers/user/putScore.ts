import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

type PutScoreProps = {
    score: number
}

export default async function putUserScore(req: FastifyRequest, res: FastifyReply) {
    try {
        const { score } = req.body as PutScoreProps ?? {}
        if (typeof score !== 'number' || !Number.isInteger(score) || score < 0) {
            return res.status(400).send({ error: 'Invalid score provided' })
        }

        const userId = req.user!.id
        const result = await run(`
            UPDATE users
            SET score = score + $1, updated_at = NOW()
            WHERE user_id = $2
            RETURNING user_id AS "userId"
        `, [score, userId])

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'User not found' })
        }

        return res.status(200).send({ id: result.rows[0].userId })
    } catch (error) {
        console.error('Error updating user score:', error)
        return res.status(500).send({ error: (error as Error).message })
    }
}
