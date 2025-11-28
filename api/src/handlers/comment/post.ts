import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'
import validateToken from '../../utils/validateToken.ts'

/**
 * Defines the VoteProps type, used for type specification when posting votes
 */
type VoteProps = {
    username: string
    courseID: string
    cardID: number
    commentID: number
    vote: boolean
}

/**
 * Defines the ReplyProps type, used for type specification when posting replies
 */
type ReplyProps = {
    username: string
    courseID: string
    cardID: number
    commentID: number
    content: string
    parent?: number
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postComment(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { username, courseID, cardID, content, parent } = req.body as ReplyProps
        if (!username || !courseID || typeof cardID != 'number' || !content) {
            return res.status(400).send({ error: 'Missing required field (username, courseID, cardID, content)' })
        }

        // Checks the token, and returns a 401 unauthorized status code if the token is invalid
        const { valid, error } = await validateToken(req, res)
        if (!valid || error) {
            return res.status(401).send({ error })
        }

        // Generates a new document reference with an auto-generated ID
        const idDocRef = db.collection('Metadata').doc('commentIDCounter')

        // Fetches the next ID from the metadata document
        const nextID = await db.runTransaction(async (transaction) => {
            // Fetches the document snapshot
            const idDocSnapshot = await transaction.get(idDocRef)

            // Checks if the document exists, and creates it if not
            if (!idDocSnapshot.exists) {
                transaction.set(idDocRef, { nextID: 1 })
                return 0
            }

            // Updates the next ID in the document
            const currentID = idDocSnapshot.data()!.nextID
            transaction.update(idDocRef, { nextID: currentID + 1 })

            // Returns the current ID
            return currentID
        })

        // Generates a new document reference with the next ID
        const commentRef = db.collection('Comment').doc(nextID.toString())

        // Creates the comment data object
        const commentData = {
            id: nextID,
            courseID,
            cardID,
            content,
            username,
            time: new Date().toISOString(),
            rating: 0,
            votes: []
        }

        // Adds the parent field to the comment data object if defined
        if (parent !== undefined) {
            // @ts-expect-error
            commentData['parent'] = parent
        }

        // Saves the comment data to Firestore
        await commentRef.set(commentData)

        // Invalidates the cache to ensure that the new comment is included
        invalidateCache(`${courseID}_comments`)

        // Returns a 201 status code with the ID of the uploaded comment
        res.status(201).send({ id: commentRef.id, nextID })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}

/**
 * Upvotes or downvotes the passed comment
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postCommentVote(req: FastifyRequest, res: FastifyReply): Promise<void> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, courseID, cardID, commentID, vote } = req.body as VoteProps

        // Validate the required fields
        if (!username || !courseID || typeof cardID !== 'number' || !commentID || vote == null) {
            return res.status(400).send({ error: 'Missing required field (username, courseID, cardID, commentID, vote)' })
        }

        // Checks the token, and returns a 401 unauthorized status code if the token is invalid
        const { valid, error } = await validateToken(req, res)
        if (!valid || error) {
            return res.status(401).send({ error })
        }

        // Fetches the comment document from Firestore
        const commentRef = db.collection('Comment').doc(commentID.toString())
        const commentDoc = await commentRef.get()

        // Checks if the comment exists, and returns a 404 status code if not
        if (!commentDoc.exists) {
            return res.status(404).send({ error: 'Comment not found' })
        }

        // Extracts the comment data from the document and returns a 404 error if the comment has no data
        const commentData = commentDoc.data()
        if (!commentData) {
            return res.status(404).send({ error: 'Comment has no data' })
        }

        // Extracts the votes and rating from the comment data
        const votes = commentData.votes || []
        const existingVoteIndex = votes.findIndex((v: { username: string }) => v.username === username)
        let newRating = commentData.rating || 0

        // Updates the votes and rating based on the user's vote
        if (existingVoteIndex >= 0) {
            const existingVote = votes[existingVoteIndex].vote

            // If the user has already voted, remove the vote if the vote is the same
            if (existingVote === vote) {
                votes.splice(existingVoteIndex, 1)
                newRating += vote ? -1 : 1
                // Updates the vote if the user has already voted, but the new vote
                // is different from the existing vote
            } else {
                votes[existingVoteIndex].vote = vote
                newRating += vote ? 2 : -2
            }
            // Adds the vote if the user has not voted before
        } else {
            votes.push({ username, vote })
            newRating += vote ? 1 : -1
        }

        // Updates the comment with the new votes and rating
        await commentRef.update({ votes, rating: newRating })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_comments`)

        // Returns a 200 status code with the ID of the updated comment
        res.status(200).send({ id: commentRef.id, rating: newRating, votes })
    } catch (err: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
