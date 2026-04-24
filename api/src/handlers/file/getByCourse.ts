import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

type FileByCourseParams = {
    courseId: string
    name: string
}

export default async function fileByCourseHandler(req: FastifyRequest, res: FastifyReply) {
    const { courseId, name } = req.params as FileByCourseParams

    if (!courseId || !name) {
        return res.status(400).send({ error: 'Missing courseId or name in params' })
    }

    try {
        const fileResponse = await run(`
            SELECT *
            FROM files
            WHERE course_id = $1
              AND name = $2
              AND deleted = false
            LIMIT 1
        `, [courseId, decodeURIComponent(name)])

        if (!fileResponse.rowCount) {
            return res.status(404).send({ error: 'File not found' })
        }

        return res.send(fileResponse.rows[0])
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
