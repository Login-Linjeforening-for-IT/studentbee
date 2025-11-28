import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function commentsHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id : string }

    try {
        const result = await run(`
            SELECT 
                id,
                card_id,
                parent_id,
                user_id,
                content,
                created_at,
                updated_at
            FROM comments
            WHERE course_id = $1
            ORDER BY created_at ASC;
        `, [id])

        const rows = result.rows

        const commentById: Record<number, any> = {}
        rows.forEach(row => {
            commentById[row.id] = {
                ...row,
                parent: row.parent_id ?? null,
                replies: []
            }
        })

        const topLevel: any[] = []
        rows.forEach(row => {
            const comment = commentById[row.id]

            if (row.parent_id) {
                commentById[row.parent_id]?.replies.push(comment)
            } else {
                topLevel.push(comment)
            }
        })

        const grouped: Record<string, any[]> = {}
        topLevel.forEach(c => {
            const key = c.card_id?.toString() ?? 'no_cardID'
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(c)
        })

        const groupedArray = Object.values(grouped)
        return res.send(groupedArray)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
