import type { FastifyRequest, FastifyReply } from 'fastify'

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
 * Upvotes or downvotes the passed comment
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export default async function postCommentVote(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
        const { username, courseID, cardID, commentID, vote } = req.body as VoteProps ?? {}
        if (!username || !courseID || typeof cardID !== 'number' || !commentID || vote == null) {
            return res.status(400).send({ error: 'Missing required field (username, courseID, cardID, commentID, vote)' })
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
        res.status(200).send({ id: commentRef.id, rating: newRating, votes })
    } catch (err: unknown) {
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
