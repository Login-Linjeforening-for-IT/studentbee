import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Editing type, used for type specification when editing courses
 */
type Editing = {
    cards: Card[]
    texts: string[]
}

/**
 * Function used to update courses in the database
 * @param req Request object
 * @param res Response objecet
 * @returns Status code based on the outcome of the operation
 */
export default async function putCourse(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { id } = req.params as { id: string }
        const { username, accepted, editing } = req.body as { username: string, accepted: Card[], editing: Editing } ?? {}

        if (!id) {
            return res.status(400).send({ error: 'Course ID is required.' })
        }

        if (!username || accepted === undefined || editing === undefined) {
            return res.status(400).send({ error: 'username, accepted, and editing are required' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({
            username,
            cards: accepted,
            unreviewed: editing.cards,
            textUnreviewed: editing.texts
        })

        res.status(200).send({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
