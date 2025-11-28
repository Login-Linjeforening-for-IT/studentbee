import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

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
    try {
        const { username, course } = req.body as { username: string, course: Course }
        if (!username || !course) {
            return res.status(400).send({ error: 'username and course are required' })
        }

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

        res.status(201).send({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
