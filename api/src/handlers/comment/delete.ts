import type { FastifyRequest, FastifyReply } from 'fastify'
import db from '#db'
import validateToken from '../../utils/validateToken.ts'

/**
 *  Defines the DeleteCommentProps type, used for type specification when deleting comments
 */
type DeleteCommentProps = {
    courseID: string
    username: string
    commentID: number
}

/**
 * Function used to delete comments from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code bsaed on the outcome of the operation
 */
export async function deleteComment(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        // Destructures relevant variables from the request body
        const { courseID, username, commentID } = req.body as DeleteCommentProps

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || typeof commentID !== 'number') {
            return res.status(400).send({ error: 'Comment ID is required' })
        }

        // Checks the token, and returns a 401 unauthorized status code if the token is invalid
        const { valid, error } = await validateToken(req, res)
        if (!valid || error) {
            return res.status(401).send({ error })
        }

        // Finds and deletes the comment from the database if found
        const commentRef = db.collection('Comment').doc(commentID.toString())
        await commentRef.delete()

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_comments`)

        // Returns a 200 status code with the id of the deleted comment
        res.send({ id: commentRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
