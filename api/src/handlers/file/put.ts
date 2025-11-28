import type { FastifyReply, FastifyRequest } from 'fastify'
import run from '#db'

/**
 * PutFileProps type, used for type specification when putting files
 */
type PutFileProps = {
    id: string
    name: string
    content: string
}

/**
 * Function used to update files in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export default async function putFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id, content } = req.body as PutFileProps ?? {}
        if (!id || !content) {
            return res.status(400).send({ error: 'Missing required field (id, content)' })
        }

        const result = await run(`
            UPDATE files
            SET content = $1
            WHERE id = $2
            RETURNING id;
        `, [content, id])

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'File not found' })
        }

        return res.status(200).send({ id: result.rows[0].id })
    } catch (error) {
        return res.status(500).send({ error: (error as Error).message })
    }
}
