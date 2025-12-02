import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function postUser(req: FastifyRequest, res: FastifyReply) {
    try {
        const { id, name, email } = req.user!

        await run(
            'INSERT INTO users (user_id, email, name) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING',
            [id, email, name]
        )

        return res.status(201).send({ id: req.user!.id })
    } catch (error) {
        console.error('Error creating user:', error)
        return res.status(500).send({ error: (error as Error).message })
    }
}
