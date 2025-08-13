import { FastifyReply, FastifyRequest } from "fastify"
import db from "../../db"
import cache from "../../flow"

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    courseID: string
}

/**
 * Fetches all comments for the given course
 * @param req Request
 * @param res Response
 */
export async function commentsHandler(req: FastifyRequest, res: FastifyReply) {
    // Destructures the courseID from the request parameters
    const { courseID } = req.params as CourseParam
        
    /**
     * Internal asynchronous function to fetch the comments from Firebase
     * @returns The comments for the specified course if found, or otherwise a string indicating the error
     */
    async function fetchComments() {
        // Fetches the comments from the 'Comment' collection in the database
        const commentsSnapshot = await db.collection('Comment')
            .where('courseID', '==', courseID)
            .get()

        // Returns an empty array if no comments are found
        const comments = commentsSnapshot.docs.map((doc: any) => doc.data())

        // Groups comments by cardID and initialize replies array
        const groupedComments: { [key: string]: any[] } = {}
        const commentById: { [key: string]: any } = {}

        // Initialize comments by cardID and group comments
        comments.forEach(comment => {
            comment.replies = []
            // Inserts the comment into commentById
            commentById[comment.id] = comment

            // Assigns the cardID to cardID, or 'no_cardID' if the cardID is not defined
            const cardID = comment.cardID || 'no_cardID'

            // Groups comments by cardID
            if (!groupedComments[cardID]) {
                groupedComments[cardID] = []
            }

            // Pushes the comment into the groupedComments array
            groupedComments[cardID].push(comment)
        })

        // Nests replies under their parent comments
        comments.forEach(comment => {
            // Assigns the parent comment to parentComment if it exists
            if (comment.parent) {
                const parentComment = commentById[comment.parent]

                // Pushes the comment into the parentComment's replies array
                if (parentComment) {
                    parentComment.replies.push(comment)
                }
            }
        })

        // Filters out comments that are replies, to avoid duplicates in the top-level array
        Object.keys(groupedComments).forEach(cardID => {
            groupedComments[cardID] = groupedComments[cardID].filter(comment => !comment.parent)
        })

        // Converts grouped comments to 2D array
        return Object.keys(groupedComments).map(cardID => groupedComments[cardID])
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the comments from cache or database and sends it as a response
        const commentsArray = await cache(`${courseID}_comments`, fetchComments)
        res.send(commentsArray)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
