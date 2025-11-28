import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * FileProps type, used for type specification when handling file parameters
 */
type FileProps = {
    id: string
}

/**
 * Fetches the file tree for the given course ID
 * @param req Request
 * @param res Response
 */
export async function fileHandler(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as FileProps

    try {
        const fileResponse = await run('SELECT * from files WHERE id = $1', [id])
        if (!fileResponse.rowCount) {
            return res.status(404).send({ error: 'File not found' })
        }

        const file = fileResponse.rows[0]
        return res.send(file)
    } catch (err) {
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
