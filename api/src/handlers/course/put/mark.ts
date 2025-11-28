import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Updates the mark of a course in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putCourseMark(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseID, mark } = req.body as { courseID: string, mark: boolean }
        if (!courseID) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (mark === undefined || mark === null) {
            return res.status(400).send({ error: 'Mark is required.' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ mark })
    
        res.status(200).send({ id: courseRef.id, mark })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).send({ error: err.message })
    }
}
