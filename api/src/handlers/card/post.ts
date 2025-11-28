import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'
import validateToken from '../../utils/validateToken.ts'

/**
 * Defines the PostCardVoteProps type, used for type specification when posting card votes
 */
type PostCardVoteProps = {
    courseID: string
    username: string
    cardID: number
    vote: boolean
}

/**
 * Uploads the given cards to storage as a struct (a unreviewed card struct directly)
 * username: string
 * token: string (user token)
 *
 * courseID: number (the course the unreviewed question is for)
 * {
 *     question: string
 *     alternatives: string[]
 *     correct: number[]
 * }
 *
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postCard(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const card = req.body as {
            username: string
            courseID: string
            question: string
            alternatives: string[]
            correct: number[]
        } ?? {}

        // Validate the required fields
        if (!card.username || !card.courseID || !card.question || !card.alternatives || card.correct === undefined) {
            return res.status(400).send({ error: 'Missing required fields' })
        }

        // Checks the token, and returns a 401 unauthorized status code if the token is invalid
        const { valid, error } = await validateToken(req, res)
        if (!valid || error) {
            return res.status(401).send({ error })
        }

        // Generate a new document reference with an auto-generated ID
        const cardRef = db.collection('CardUnreviewed').doc()

        // Save the card data to Firestore, including the courseID
        await cardRef.set({
            username: card.username,
            courseID: card.courseID,
            question: card.question,
            alternatives: card.alternatives,
            correct: card.correct
        })

        res.status(201).send({ id: cardRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}

/**
 * Upvotes or downvotes the passed card
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postCardVote(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { courseID, username, cardID, vote } = req.body as PostCardVoteProps ?? {}

        // Validate the required fields
        if (!courseID || !username || typeof cardID !== 'number' || vote == null) {
            return res.status(400).send({ error: 'Missing required field (courseID, username, cardID, vote)' })
        }

        // Fetches the course document from Firestore
        const courseRef = db.collection('Course').doc(courseID.toString())
        const courseDoc = await courseRef.get()

        // Checks if the course exists, and returns a 404 status code if not
        if (!courseDoc.exists) {
            return res.status(404).send({ error: 'Course not found' })
        }

        // Extracts the course data from the document and assigns it to the courseData variable
        const courseData = courseDoc.data()

        // Checks if the course has data, and returns a 404 status code if not
        if (!courseData) {
            return res.status(404).send({ error: 'Course has no data' })
        }

        // Checks if the cards field is an array and if the cardID is within the array
        if (!Array.isArray(courseData.cards) || !courseData.cards[cardID]) {
            return res.status(404).send({ error: 'Card not found' })
        }

        // Extracts the votes and rating from the card data
        const votes = courseData.cards[cardID].votes || []
        const existingVoteIndex = votes.findIndex((v: { username: string }) => v.username === username)
        let newRating = courseData.cards[cardID].rating || 0

        // Updates the votes and rating based on the user's vote
        if (existingVoteIndex >= 0) {
            const existingVote = votes[existingVoteIndex].vote

            // If the user has already voted, removes the vote if the vote is the same
            if (existingVote === vote) {
                votes.splice(existingVoteIndex, 1)
                newRating += vote ? -1 : 1
                // Updates the vote if the user has already voted, but the new vote is different
            } else {
                votes[existingVoteIndex].vote = vote
                newRating += vote ? 2 : -2
            }
            // Adds the vote if the user has not voted before
        } else {
            votes.push({ username, vote })
            newRating += vote ? 1 : -1
        }

        // Updates the card with the new votes and rating
        const updatedCards = [...courseData.cards]
        updatedCards[cardID] = {
            ...updatedCards[cardID],
            votes,
            rating: newRating
        }

        // Updates the course with the updated cards
        await courseRef.update({ cards: updatedCards })

        res.status(200).send({ id: courseRef.id, rating: newRating, votes })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).send({ error: err.message })
    }
}
