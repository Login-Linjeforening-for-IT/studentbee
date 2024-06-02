import { Request, Response } from 'express'
import db from '../db'
import cache from '../flow'

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

        await batch.commit()

        // Updates cache
        await cache(`${userID}_comments`, async () => {
            const commentsSnapshot = await db.collection('Comment').where('userID', '==', userID).get()
            const comments = commentsSnapshot.docs.map((doc: any) => doc.data())
            return comments
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

        // Updates cache
        await cache(`${courseID}_files`, async () => {
            const filesSnapshot = await db.collection('Files').where('courseID', '==', courseID).get()
            if (filesSnapshot.empty) {
                return []
            }

            const files = filesSnapshot.docs.map((doc: any) => doc.data())
            return files
        })

        res.status(200).json({ id: fileRef.id })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })
        
    }
}
