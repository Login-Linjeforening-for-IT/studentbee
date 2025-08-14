import { FastifyReply, FastifyRequest } from "fastify"
import db from "../../db"
import cache, { invalidateCache } from "../../flow"
import isUserOnScoreboard from "../../utils/isUserOnScoreboard"

/**
 * UserParam type, used for type specification when handling user parameters
 */
type UserParam = {
    username: string
}

// 5 minutes in milliseconds
const FIVE_MINUTES = 5 * 60 * 1000

/**
 * Log to keep track of user score updates. This is used to prevent users from
 * updating their score multiple times in a short period. It stores the username
 * and timestamp of the last update
 */
let log = [] as { username: string, score: number, time: number, timestamp: string }[]

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

/**
 * Updates user score in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function scoreHandler(req: FastifyRequest, res: FastifyReply): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username } = req.params as { username: string }
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username) {
            return res.status(400).send({ error: 'Username is required.' })
        }

        // Checks if the user has already updated their score in the last second
        if (log.some(entry => entry.username === username && new Date(entry.timestamp).getTime() > Date.now() - 1000)) {
            const score = log.find(entry => entry.username === username)?.score || 10
            const time = log.find(entry => entry.username === username)?.time || 1000
            return res.status(400).send({ username, score, time, error: 'You can only update your score once every second.' })
        }

        const oldScore = log.find(entry => entry.username === username)?.score || 10
        const oldTime = log.find(entry => entry.username === username)?.time || 1000
        log.push({ username, score: oldScore, time: oldTime, timestamp: new Date().toISOString() })

        // Removes entries older than 5 minutes from the log
        const fiveMinutesAgo = new Date(Date.now() - FIVE_MINUTES).toISOString()
        log = log.filter(entry => entry.timestamp > fiveMinutesAgo)

        // Finds the user in the database and updates it with the new data
        const userRef = db.collection('User').doc(username)
        const userSnapShot = await userRef.get()
        if (!userSnapShot.exists) {
            return res.status(404).send({ error: 'User not found.' })
        }

        // Gives 10 score for each update (correct answer), and a reasonable
        // time increase. If the user was updated within 5 minutes, it will use
        // the difference in time since the last update, otherwise it will use a 
        // default value of 5000 milliseconds. Reasonable time from open to first 
        // answer.
        const score = userSnapShot.data()?.score + 10 || 10
        const timeDiff = Date.now() - (userSnapShot.data()?.last_updated || 0)
        const reasonableTimeDiff = timeDiff > FIVE_MINUTES ? 5000 : timeDiff
        const time = userSnapShot.data()?.time + reasonableTimeDiff || 1000
        await userRef.update({ score, time, last_updated: Date.now() })
        const logEntry = log.find(entry => entry.username === username)
        if (logEntry) {
            logEntry.score = score
            logEntry.time = time
        }

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`user_${username}`)

        // Invalidates the scoreboard cache if the user is on the scoreboard
        if (await isUserOnScoreboard(username)) {
            invalidateCache('scoreboard')
        }

        // Returns a 200 status code with the id of the updated user
        res.send({ username: userRef.id, score, time })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
