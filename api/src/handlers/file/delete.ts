import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * Function used to delete files from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export default async function deleteFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id } = req.params as { id : string }
        if (!id) {
            return res.status(400).send({ error: 'id is required' })
        }

        const fileResponse = await run('DELETE FROM files WHERE id = $1', [id])
        if (!fileResponse.rowCount) {
            res.status(404).send({ error: 'File not found' })
        }

        res.send({ id })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).send({ error: err.message })
    }
}
