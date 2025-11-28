import type { FastifyRequest, FastifyReply } from 'fastify'
import db from '#db'
import run from '#db'

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
    const { username, commentID } = req.body as DeleteCommentProps ?? {}

    try {
        if (!username || typeof commentID !== 'number') {
            return res.status(400).send({ error: 'Comment ID is required' })
        }

        const response = await run('DELETE')
        // Finds and deletes the comment from the database if found
        const commentRef = db.collection('Comment').doc(commentID.toString())
        await commentRef.delete()

        res.send({ id: commentRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
