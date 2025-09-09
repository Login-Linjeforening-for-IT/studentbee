import { FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db'
import { invalidateCache } from '../../flow'

/**
 * Defines the Card type, used for type specification when handling cards
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
 * Files type, used for type specification when handling files
 */
type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

/**
 * Defines the Course type, used for type specification when handling courses
 */
type Course = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    textUnreviewed: string[]
    files: Files
}

/**
 * Uploads the given course to storage as a Course object
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postCourse(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, course } = req.body as { username: string, course: Course }

        // Validate the required fields
        if (!username || !course) {
            return res.status(400).send({ error: 'username and course are required' })
        }

        // Checks the token, and returns a 401 unauthoirzed status code if the token is invalid
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Checks if the course has an ID field, and returns a 400 status code if it does not
        const courseID = course.id
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        // Generates a document reference with the courseID
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.set(course)

        // Creates root file for the course
        const fileRef = db.collection('Files').doc(`${courseID}:root`)
        await fileRef.set({
            courseID,
            name: 'root',
            content: '',
            files: []
        })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache('courses')

        // Returns a 201 status code with the ID of the uploaded course
        res.status(201).send({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
