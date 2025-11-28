import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

/**
 * PutFileProps type, used for type specification when putting files
 */
type PutFileProps = {
    courseID: string
    name: string
    content: string
}

/**
 * Function used to update files in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseID, name, content } = req.body as PutFileProps ?? {}
        if (!courseID || !name || !content) {
            return res.status(400).send({ error: 'Missing required field (courseID, name, content)' })
        }

        // Finds the file in the database and updates it with the new content
        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)
        await fileRef.update({ content })

        // Returns a 201 status code with the id of the updated file
        res.status(201).send({ id: fileRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
