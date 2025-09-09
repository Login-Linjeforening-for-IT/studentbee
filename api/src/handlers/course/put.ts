import { FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db'
import { invalidateCache } from '../../flow'

/**
 * Editing type, used for type specification when editing courses
 */
type Editing = {
    cards: Card[]
    texts: string[]
}

/**
 * Card type, used for type specification when creating cards
 */
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

/**
 * Function used to update courses in the database
 * @param req Request object
 * @param res Response objecet
 * @returns Status code based on the outcome of the operation
 */
export async function putCourse(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures the courseID from the request parameters
        const { courseID } = req.params as { courseID: string }

        // Destructures relevant variables from the request body
        const { username, accepted, editing } = req.body as { username: string, accepted: Card[], editing: Editing }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || accepted === undefined || editing === undefined) {
            return res.status(400).send({ error: 'username, accepted, and editing are required' })
        }

        // Checks if the courseID is defined, or otherwise returns a 400 status code
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({
            username,
            cards: accepted,
            unreviewed: editing.cards,
            textUnreviewed: editing.texts
        })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the id of the updated course
        res.status(200).send({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}

/**
 * // Updates unreviewed course text in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putCourseText(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, courseID, text } = req.body as { username: string, courseID: string, text: string[] }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || !courseID || !text) {
            return res.status(400).send({ error: 'username, accepted, and editing are required' })
        }

        // Finds the course in the database and updates it with the new data
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Finds the course in the database and updates it with the new data
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ username, textUnreviewed: text })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the id of the updated course
        res.send({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}


/**
 * Updates the mark of a course in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putCourseMark(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { courseID, mark } = req.body as { courseID: string, mark: boolean }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (mark === undefined || mark === null) {
            return res.status(400).send({ error: 'Mark is required.' })
        }

        // Finds the course in the database and updates it with the new data
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ mark })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the id of the updated course
        res.status(200).send({ id: courseRef.id, mark })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).send({ error: err.message })
    }
}
