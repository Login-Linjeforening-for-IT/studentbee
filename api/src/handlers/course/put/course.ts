import type { FastifyReply, FastifyRequest } from 'fastify'
import { runInTransaction } from '#db'

export default async function putCourse(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id } = req.params as { id: string }
        const { cards, notes } = req.body as { cards: any[]; notes: string } ?? {}

        if (!id || !req.user?.id) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        const userId = req.user.id

        if (!Array.isArray(cards) || typeof notes !== 'string') {
            return res.status(400).send({ error: 'Cards and notes are required.' })
        }

        const updatedCourse = await runInTransaction(async (client) => {
            const result = await client.query(
                `
                UPDATE courses
                SET
                    notes = $1,
                    updated_by = $2,
                    updated_at = NOW()
                WHERE id = $3
                RETURNING id;
                `,
                [notes, userId, id]
            )

            if (result.rowCount === 0) {
                return res.status(404).send({ error: 'Course not found' })
            }

            if (Array.isArray(cards)) {
                await client.query(`DELETE FROM cards WHERE course_id = $1`, [id])

                for (const card of cards) {
                    const { question, alternatives, answers, theme, source, help } = card

                    await client.query(
                        `
                        INSERT INTO cards (
                            course_id,
                            question,
                            alternatives,
                            answers,
                            theme,
                            source,
                            help,
                            created_by,
                            updated_by
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8);
                        `,
                        [
                            id,
                            question,
                            alternatives,
                            answers,
                            theme ?? null,
                            source ?? null,
                            help ?? null,
                            req.user?.id,
                        ]
                    )
                }
            }

            return result.rows[0]
        })

        return res.status(200).send({ id: updatedCourse.id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
