import { Request, Response } from 'express'
import db from '../db'
import { invalidateCache } from '../flow'

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
        const { username, accepted, editing } = req.body as { username: string, accepted: Card[], editing: Editing }
        
        if (!username || accepted === undefined || editing === undefined) {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
        }

        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({
            username,
            cards: accepted,
            unreviewed: editing.cards,
            textUnreviewed: editing.texts
        })

        invalidateCache(courseID)
        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        console.error('Error in putCourse:', error)
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
        
        invalidateCache(`${courseID}:${name}`)
        invalidateCache(`${courseID}_files`)
        res.status(201).json({ id: fileRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putText(req: Request, res: Response) {
    try {
        const { username, courseID, text } = req.body as { username: string, courseID: string, text: string[] }
        
        if (!username || !courseID || !text) {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ username, textUnreviewed: text })

        invalidateCache(courseID)
        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putTime(req: Request, res: Response) {
    try {
        const { username, time } = req.body as { username: string, time: number }
        
        if (!username || typeof time !== 'number') {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const courseRef = db.collection('User').doc(username)
        await courseRef.update({time})

        invalidateCache(`user_${username}`)
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

        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({mark})

        invalidateCache(courseID)
        res.status(200).json({ id: courseRef.id, mark })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })   
    }
}