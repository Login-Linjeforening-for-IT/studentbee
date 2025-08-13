import { FastifyReply, FastifyRequest } from "fastify"
import { invalidateCache } from "../../flow"
import db from "../../db"

/**
 * Updates user socre in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putScore(req: FastifyRequest, res: FastifyReply): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, score } = req.body as { username: string, score: number }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || typeof score !== 'number') {
            return res.status(400).send({ error: 'username, accepted, and editing are required' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('User').doc(username)
        await courseRef.update({score})

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`user_${username}`)

        // Returns a 200 status code with the id of the updated course
        res.send({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}

/**
 * Updates user time spent doing courses in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putTime(req: FastifyRequest, res: FastifyReply): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, time } = req.body as { username: string, time: number }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || typeof time !== 'number') {
            return res.status(400).send({ error: 'username, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Finds the user in the database and updates it with the new data
        const userRef = db.collection('User').doc(username)
        await userRef.update({time})

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`user_${username}`)

        // Returns a 200 status code with the id of the updated course
        res.send({ id: userRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
