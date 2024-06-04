// Used for type specification when recieving requests
import { Request, Response } from 'express'

// Imports the database instance, necesarry to persist operations to the database
import db from '../db'

// Imports the invalidateCache function from the flow module, used to invalidate 
// the cache, ensuring that the data served is up to date
import { invalidateCache } from '../flow'

/**
 *  Defines the DeleteCommentProps type, used for type specification when deleting comments
 */
type DeleteCommentProps = {
    courseID: string
    username: string
    commentID: number
}

/**
 * Defines the DeleteFileProps type, used for type specification when deleting files
 */
type DeleteFileProps = {
    courseID: string
    fileID: string
}

/**
 * Function used to delete comments from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code bsaed on the outcome of the operation
 */
export async function deleteComment(req: Request, res: Response) {
    try {
        // Destructures relevant variables from the request body 
        const { courseID, username, commentID } = req.body as DeleteCommentProps

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || typeof commentID !== 'number') {
            return res.status(400).json({ error: 'Comment ID is required' })
        }

        // Checks the token, and returns a 401 unauthoirzed status code if the token is invalid
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Finds and deletes the comment from the database if found
        const commentRef = db.collection('Comment').doc(commentID.toString())
        await commentRef.delete()

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_comments`)

        // Returns a 200 status code with the id of the deleted comment
        res.status(200).json({ id: commentRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Function used to delete files from the database
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function deleteFile(req: Request, res: Response) {
    try {
        // Destructures the courseID and fileID from the request parameters
        const { courseID, fileID } = req.params as DeleteFileProps

        // Checks if the required variables are defined, or otherwise returns a 400 status code
        if (!courseID || !fileID) {
            return res.status(400).json({ error: 'Course ID and File ID are required' })
        }

        // Finds and deletes the comment from the database if found
        const fileRef = db.collection('Files').doc(`${courseID}:${fileID}`)
        await fileRef.delete()

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_files`)

        // Returns a 200 status code with the id of the deleted file
        res.status(200).json({ id: fileRef.id })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).json({ error: err.message })
        
    }
}
