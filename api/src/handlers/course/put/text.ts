import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Updates unreviewed course text in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putCourseText(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, courseID, text } = req.body as { username: string, courseID: string, text: string[] } ?? {}

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || !courseID || !text) {
            return res.status(400).send({ error: 'username, accepted, and editing are required' })
        }

        // Finds the course in the database and updates it with the new data
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ username, textUnreviewed: text })

        res.send({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
