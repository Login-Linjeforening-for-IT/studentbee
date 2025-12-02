import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    id?: string
    code?: string
}

/**
 * Fetches course by id
 * @param req Request
 * @param res Response
 */
export async function courseHandler(req: FastifyRequest, res: FastifyReply) {
    const { id, code } = req.params as CourseParam

    try {
        const result = await run(`
            SELECT c.*,
                COALESCE(json_agg(
                    DISTINCT jsonb_build_object(
                        'id', cards.id,
                        'courseId', cards.course_id,
                        'question', cards.question,
                        'alternatives', cards.alternatives,
                        'answers', cards.answers,
                        'theme', cards.theme,
                        'source', cards.source,
                        'help', cards.help,
                        'createdBy', cards.created_by,
                        'createdAt', cards.created_at,
                        'updatedBy', cards.updated_by,
                        'updatedAt', cards.updated_at
                    )
                ) FILTER (WHERE cards.id IS NOT NULL), '[]') as cards,
                COALESCE(json_agg(
                    DISTINCT jsonb_build_object('username', cv.user_id, 'vote', cv.is_upvote)
                ) FILTER (WHERE cv.id IS NOT NULL), '[]') as votes,
                COALESCE(count(CASE WHEN cv.is_upvote THEN 1 END) 
                            - count(CASE WHEN cv.is_upvote = false THEN 1 END), 0)::INT as rating
            FROM courses c
            LEFT JOIN cards ON c.id = cards.course_id
            LEFT JOIN card_votes cv ON cards.id = cv.card_id
            WHERE ${id ? 'c.id' : 'c.course_code'} = $1
            GROUP BY c.id
        `, [id || code?.toUpperCase()])

        if (!result.rowCount) {
            return res.status(404).send({ error: 'Course not found' })
        }

        const rows = result.rows
        const course = {
            id: rows[0].id,
            courseCode: rows[0].course_code,
            name: rows[0].name,
            notes: rows[0].notes,
            learningBased: rows[0].learning_based,
            createdBy: rows[0].created_by,
            createdAt: rows[0].created_at,
            updatedBy: rows[0].updated_by,
            updatedAt: rows[0].updated_at,
            votes: rows[0].votes,
            rating: rows[0].rating,
            cards: rows[0].cards
        }

        return res.send(course)
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
