import { Request, Response } from 'express'
import db from '../db'

type Editing = {
    cards: Card[]
    texts: string[]
}

type Card = {
    question: string
    alternatives: string[]
    correct: number[]
    source: string
    rating: number
    votes: number[]
    help?: string
    theme?: string
}

type PutFileProps = {
    courseID: string
    name: string
    content: string
}

export async function putCourse(req: Request, res: Response) {
    try {
        const { courseID } = req.params
        const { userID, accepted, editing } = req.body as { userID: number, accepted: Card[], editing: Editing }
        
        if (!userID || accepted === undefined || editing === undefined) {
            return res.status(400).json({ error: 'userID, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({
            userID,
            cards: accepted,
            unreviewed: editing.cards,
            textUnreviewed: editing.texts
        })

        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putFile(req: Request, res: Response) {
    try {
        const { courseID, name, content } = req.body as PutFileProps

        if (!courseID || !name || !content) {
            return res.status(400).json({ error: 'Missing required field (courseID, name, content)' })
        }

        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)
        await fileRef.update({ content })

        // Respond with the ID of the newly created comment
        res.status(201).json({ id: fileRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putText(req: Request, res: Response) {
    try {
        const { userID, courseID, text } = req.body as { userID: number, courseID: string, text: string[] }
        
        if (!userID || !courseID || !text) {
            return res.status(400).json({ error: 'userID, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ userID, textUnreviewed: text })

        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putTime(req: Request, res: Response) {
    try {
        const { userID, time } = req.body as { userID: string, time: number }
        
        if (!userID || typeof time !== 'number') {
            return res.status(400).json({ error: 'userID, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const courseRef = db.collection('User').doc(userID)
        await courseRef.update({time})

        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putMarkCourse(req: Request, res: Response) {
    try {
        const { courseID, mark } = req.body as { courseID: string, mark: boolean }

        
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        if (typeof mark === undefined || mark === null) {
            return res.status(400).json({ error: 'Mark is required.' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({mark})

        res.status(200).json({ id: courseRef.id, mark })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })   
    }
}