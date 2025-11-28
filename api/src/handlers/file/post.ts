import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'
import run from '#db'

/**
 * Defines the PostFileProps type, used for type specification when posting files
 */
type PostFileProps = {
    courseID: string
    name: string
    parent?: string
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export async function postFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseID, name, parent } = req.body as PostFileProps ?? {}
        if (!courseID || !name) {
            return res.status(400).send({ error: 'Missing required field (courseID, name)' })
        }

        // Generates a new document reference with the courseID and name
        const fileResponse = await run('INSERT INTO files ', [courseID])
        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)

        // Creates the file data object
        const fileData = {
            courseID,
            name
        }

        // Adds the parent field to the file data object if defined
        if (parent !== undefined) {
            // @ts-expect-error
            fileData['parent'] = parent
        }

        // Saves the file data to Firestore
        await fileRef.set(fileData)
        res.status(201).send({ name })
    } catch (err) {
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
