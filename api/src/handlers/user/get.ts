import { FastifyReply, FastifyRequest } from "fastify"
import db from "../../db"
import cache from "../../flow"

/**
 * UserParam type, used for type specification when handling user parameters
 */
type UserParam = {
    username: string
}

/**
 * Fetches the user profile for the given user
 * @param req Request
 * @param res Response
 */
export async function profileHandler(req: FastifyRequest, res: FastifyReply) {
    // Destructures the username from the request parameters
    const { username } = req.params as UserParam

    /**
     * Internal asynchronous function to fetch the user profile from Firebase
     * @returns The user profile for the specified user if found, or otherwise a string indicating the error
     */
    async function fetchUserProfile() {
        // Fetches the user profile from the 'User' collection in the database
        const userProfileDoc = await db.collection('User').doc(username).get()

        // Returns an error if the user profile is not found
        if (!userProfileDoc.exists) {
            return 'User not found'
        }

        // Assigns the data to data if it exists
        const data = userProfileDoc.data()

        // Returns an error if the user has no data
        if (!data) {
            return 'User has no data'
        }

        // Returns the user profile
        return {
            username,
            name: data.firstName + ' ' + data.lastName,
            score: data.score,
            solved: data.solved,
            time: data.time,
        }
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the user profile from cache or database and sends it as a response
        const userProfile = await cache(`user_${username}`, fetchUserProfile)
        res.send(userProfile)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
