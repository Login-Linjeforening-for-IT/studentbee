import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function commentsHandler(req: FastifyRequest, res: FastifyReply) {
    const { cardId } = req.params as { cardId : string }

    try {
        const result = await run(`
            SELECT c.id,
                   c.card_id AS "cardId",
                   c.parent_id AS "parentId",
                   c.content,
                   c.created_at AS "createdAt",
                   c.updated_at AS "updatedAt",
                   COALESCE(u.name, c.user_id) AS "username"
            FROM comments c
            LEFT JOIN users u ON u.user_id = c.user_id
            WHERE c.card_id = $1
            ORDER BY c.created_at ASC;
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
