import { FastifyReply, FastifyRequest } from "fastify"
import { generateToken } from "../../manager"
import db from "../../db"

/**
 * Logs in the user
 * Request:
 * username: string
 * password: string
 *
 * Response:
 * id: number
 * name: string
 * token: string (the api needs to keep track of tokens for each user and encrypt these)
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postLogin(req: FastifyRequest, res: FastifyReply): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, password } = req.body as {
            username: string
            password: string
        }

        // Validate the required fields
        if (!username || !password) {
            return res.status(400).send({ error: 'Username and password are required' })
        }

        // Fetches the user data from Firestore
        const userDoc = await db.collection('User').doc(username).get()

        // Checks if the user exists, and returns a 404 status code if not
        if (!userDoc.exists) {
            return res.status(404).send({ error: 'User not found' })
        }

        // Extracts the user data from the document
        const userData = userDoc.data()

        // Checks if the user has data, and returns a 404 status code if not
        if (!userData) {
            return res.status(404).send({ error: 'User has no data' })
        }

        // Temporarily disabled till after exams
        // if (userData.password !== password) { 
        //     return res.status(401).json({ error: 'Invalid username or password' })
        // }

        // Generate the token
        const token = generateToken(userDoc.id)

        // Respond with user details and the generated token
        res.send({
            name: `${userData.firstName} ${userData.lastName}`,
            username,
            time: userData.time,
            token,
            score: userData.score,
            solved: userData.solved
        })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
