import { Request, Response } from 'express'
import db from '../db'

type DeleteCommentProps = {
    userID: number
    commentID: number
}

type DeleteFileProps = {
    courseID: string
    fileID: string
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const { userID, commentID } = req.body as DeleteCommentProps

        if (!userID || typeof commentID !== 'number') {
            return res.status(400).json({ error: 'Comment ID is required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const commentRef = db.collection('Comment').doc(commentID.toString())
        await commentRef.delete()

        const repliesSnapshot = await db.collection('Comment').where('parent', '==', commentID).get()
        const batch = db.batch()

        repliesSnapshot.forEach(doc => {
            batch.delete(doc.ref)
        })

        res.status(200).json({ id: commentRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function deleteFile(req: Request, res: Response) {
    try {
        const { courseID, fileID } = req.params as DeleteFileProps

        if (!courseID || !fileID) {
            return res.status(400).json({ error: 'Course ID and File ID are required' })
        }

        const fileRef = db.collection('Files').doc(`${courseID}:${fileID}`)
        await fileRef.delete()

        res.status(200).json({ id: fileRef.id })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })
        
    }
}
