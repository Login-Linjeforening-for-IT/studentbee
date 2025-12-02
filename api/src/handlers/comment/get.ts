import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function commentsHandler(req: FastifyRequest, res: FastifyReply) {
    const { cardId } = req.params as { cardId : string }

    try {
        const result = await run(`
            SELECT * FROM comments
            WHERE card_id = $1
            ORDER BY created_at ASC;
        `, [cardId])

        const rows = result.rows
        const commentById: Record<number, any> = {}
        rows.forEach(row => {
            commentById[row.id] = {
                ...row,
                parent: row.parentId ?? null,
                replies: []
            }
        })

        const comments: any[] = []
        rows.forEach(row => {
            const comment = commentById[row.id]

            if (row.parentId) {
                commentById[row.parentId]?.replies.push(comment)
            } else {
                comments.push(comment)
            }
        })

        return res.send(comments)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
