import { FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db'
import { invalidateCache } from '../../flow'
import validateToken from '../../utils/validateToken'

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
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { courseID, name, content } = req.body as PutFileProps

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!courseID || !name || !content) {
            return res.status(400).send({ error: 'Missing required field (courseID, name, content)' })
        }

        // Checks the token, and returns a 401 unauthorized status code if the token is invalid
        const { valid, error } = await validateToken(req, res)
        if (!valid || error) {
            return res.status(401).send({ error })
        }

        // Finds the file in the database and updates it with the new content
        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)
        await fileRef.update({ content })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}:${name}`)
        invalidateCache(`${courseID}_files`)

        // Returns a 201 status code with the id of the updated file
        res.status(201).send({ id: fileRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}