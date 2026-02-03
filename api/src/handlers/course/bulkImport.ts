import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

export default async function bulkImport(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const courses = req.body as any[]
        const userId = (req as any).user?.id ?? null

        if (!Array.isArray(courses)) {
            return res.status(400).send({ error: 'Body must be an array of courses' })
        }

        const results: {
            course: string
            imported: boolean
            cardsInserted: number
            error?: string
        }[] = []

        for (const course of courses) {
            try {
                if (!course.id || !Array.isArray(course.cards)) {
                    throw new Error('Invalid course structure')
                }

                const courseResult = await run(`
                    INSERT INTO courses (code, name, notes, created_by, updated_by)
                    VALUES ($1, $2, '', $3, $3)
                    ON CONFLICT (code)
                    DO UPDATE SET updated_at = NOW(), updated_by = $3
                    RETURNING id
                `, [course.id.toUpperCase(), course.id.toUpperCase(), userId])

                const courseId = courseResult.rows[0].id
                let cardsInserted = 0

                for (const card of course.cards) {
                    if (
                        !card.question ||
                        !Array.isArray(card.alternatives) ||
                        !Array.isArray(card.correct)
                    ) {
                        throw new Error(`Invalid card structure`)
                    }

                    const cardResult = await run(`
                        INSERT INTO cards (
                        course_id,
                        question,
                        alternatives,
                        answers,
                        theme,
                        source,
                        created_by,
                        updated_by
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
                        ON CONFLICT (question) DO NOTHING
                    `, [
                        courseId,
                        card.question,
                        card.alternatives,
                        card.correct,
                        card.theme ?? null,
                        card.source ?? null,
                        userId,
                    ])

                    if (cardResult.rowCount === 1) {
                        cardsInserted++
                    }
                }

                results.push({
                    course: course.id,
                    imported: true,
                    cardsInserted,
                })
            } catch (courseError) {
                results.push({
                    course: course.id ?? 'unknown',
                    imported: false,
                    cardsInserted: 0,
                    error: (courseError as Error).message,
                })
            }
        }

        return res.status(201).send({ results })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
