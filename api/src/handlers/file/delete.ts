import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

/**
 * Defines the DeleteFileProps type, used for type specification when deleting files
 */
type DeleteFileProps = {
    courseID: string
    fileID: string
}

/**
 * Function used to delete files from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function deleteFile(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        // Destructures the courseID and fileID from the request parameters
        const { courseID, fileID } = req.params as DeleteFileProps

        // Checks if the required variables are defined, or otherwise returns a 400 status code
        if (!courseID || !fileID) {
            return res.status(400).send({ error: 'Course ID and File ID are required' })
        }

        // Finds and deletes the comment from the database if found
        const fileRef = db.collection('Files').doc(`${courseID}:${fileID}`)
        await fileRef.delete()

        // Returns a 200 status code with the id of the deleted file
        res.send({ id: fileRef.id })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).send({ error: err.message })
    }
}
