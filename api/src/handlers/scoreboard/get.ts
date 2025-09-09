import { FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db'
import cache from '../../flow'

/**
 * Fetches the first 100 users on the scoreboard from Firebase
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function scoreboardHandler(_: FastifyRequest, res: FastifyReply) {

    /**
     * Internal asynchronous function to fetch the scoreboard from Firebase
     * @returns The (top 100) users on the scoreboard
     */
    async function fetchScoreboard() {
        // Fetches the users from the 'User' collection in the database
        const snapshot = await db.collection('User')
            .orderBy('score', 'desc')
            .limit(100)
            .get()

        // Constructs the scoreboard
        return snapshot.docs.map((doc) => ({
            username: doc.id,
            name: doc.data().name,
            score: doc.data().score,
            solved: doc.data().solved.length,
            time: doc.data().time,
            seen: doc.data().last_updated
        }))
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the scoreboard from cache or database and sends it as a response
        const scoreboard = await cache('scoreboard', fetchScoreboard)
        res.send(scoreboard)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
