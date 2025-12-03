import run from '#db'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function deleteCourse(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string }
    if (!id) {
        return res.status(400).send({ error: 'Invalid course ID' })
    }

    try {
        const { rowCount } = await run('DELETE FROM courses WHERE id = $1', [id])
        if (!rowCount) {
            return res.status(404).send({ error: 'Course not found.' })
        }

        return res.status(200).send({ message: 'Course deleted successfully' })
    } catch (error) {
        console.error(`Failed to delete course ${id}`)
        console.log(`Details: ${error}`)
        return res.status(500).send({ error: 'Failed to delete course' })
    }
}
