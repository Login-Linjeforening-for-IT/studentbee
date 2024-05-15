import { Request, Response } from 'express'
import db from './db'

export const getScoreboard = async (_: Request, res: Response) => {
    try {
        const scoreboard = await db.any('SELECT id, name, score, time FROM "User" ORDER BY score DESC LIMIT 100')
        res.json(scoreboard)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export const getCourses = async (_: Request, res: Response) => {
    try {
        const courses = await db.any(`
            SELECT c.id, COUNT(f.id) as flashcard_count
            FROM Course c
            LEFT JOIN FlashCard f ON c.id = f.course_id
            GROUP BY c.id
        `)
        res.json(courses)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export const getReviewedFlashcards = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params
        const flashcards = await db.any('SELECT * FROM FlashCard WHERE course_id = $1', [courseId])
        res.json(flashcards)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export const getAllFlashcards = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params
        const flashcards = await db.any(`
            SELECT * FROM FlashCard
            WHERE course_id = $1
            UNION
            SELECT * FROM FlashCardUnreviewed
            WHERE course_id = $1
        `, [courseId])
        res.json(flashcards)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const userProfile = await db.oneOrNone('SELECT * FROM "User" WHERE id = $1', [userId])
        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(userProfile)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export const getIndexHandler = (_: Request, res: Response) => {
    res.json({ message: "Welcome to the API!\n\nValid endpoints are:\n\n/ - Y" +
    "ou are here, this displays info about the API\n/scoreboard - Returns the" +
    " first 100 users on the scoreboard\n/courses - Returns a list of all cou" +
    "rses\n/courses/:courseId/reviewed - Returns a list of all reviewed flash" + 
    "cards\n/courses/:courseId/flashcards - Returns all flashcards, reviewed " +
    "or not\n/users/:userId - Returns all info for every user" })
}