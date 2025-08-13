import { FastifyReply, FastifyRequest } from "fastify"
import { invalidateCache } from "../../flow"
import db from "../../db"

/**
 * Defines the PostFileProps type, used for type specification when posting files
 */
type PostFileProps = {
    courseID: string
    name: string
    parent?: string
}

/**
 * Defines the Files type, used for type specification when handling files
 */
type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export async function postFile(req: FastifyRequest, res: FastifyReply): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { courseID, name, parent } = req.body as PostFileProps

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!courseID || !name) {
            return res.status(400).send({ error: 'Missing required field (courseID, name)' })
        }

        // Generates a new document reference with the courseID and name
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

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_files`)
        res.status(201).send({ name })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
