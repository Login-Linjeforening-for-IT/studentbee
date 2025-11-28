import run from '#db'
import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Fetches a list of all courses in the database
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function coursesHandler(_: FastifyRequest, res: FastifyReply) {
    try {
        const result = await run(`
            SELECT 
                c.id, 
                c.course_code, 
                c.name, 
                COUNT(cards.id) AS card_count
            FROM courses c
            LEFT JOIN cards ON cards.course_id = c.id
            GROUP BY c.id
            ORDER BY c.name
        `)
        return res.send(result.rows)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
