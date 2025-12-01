import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    id: string
}

/**
 * Fetches course by id
 * @param req Request
 * @param res Response
 */
export async function courseHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as CourseParam

    try {
        const result = await run(`
            SELECT c.*,
                   COALESCE(json_agg(
                       json_build_object('username', cv.user_id, 'vote', cv.is_upvote)
                   ) FILTER (WHERE cv.id IS NOT NULL), '[]'::json) as votes,
                   COALESCE(count(CASE WHEN cv.is_upvote THEN 1 END) - count(CASE WHEN cv.is_upvote = false THEN 1 END), 0) as rating,
                   COALESCE(json_agg(cards.*) FILTER (WHERE cards.id IS NOT NULL), '[]'::json) as cards
            FROM courses c
            LEFT JOIN cards ON c.id = cards.course_id
            LEFT JOIN card_votes cv ON cards.id = cv.card_id
            WHERE c.course_code = $1
            GROUP BY c.id, cards.id
        `, [id])

        if (!result.rowCount) {
            return res.status(404).send({ error: 'Course not found' })
        }

        const rows = result.rows
        const course = {
            id: rows[0].id,
            course_code: rows[0].course_code,
            name: rows[0].name,
            notes: rows[0].notes,
            learning_based: rows[0].learning_based,
            created_by: rows[0].created_by,
            created_at: rows[0].created_at,
            updated_by: rows[0].updated_by,
            updated_at: rows[0].updated_at,
            cards: rows.map(row => ({ ...row.cards[0], votes: row.votes, rating: row.rating }))
        }

        return res.send(course)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
