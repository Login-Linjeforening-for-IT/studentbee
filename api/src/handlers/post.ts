// Used for type specification when recieving requests
import { Request, Response } from 'express'

// Imports the database instance, necesarry to persist operations to the database
import db from '../db'

// Imports the generateToken function from the manager module, used to generate tokens
import { generateToken } from '../manager'

// Imports the invalidateCache function from the flow module, used to invalidate
import { invalidateCache } from '../flow'

/**
 * Defines the Course type, used for type specification when handling courses
 */
type Course = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    textUnreviewed: string[]
    files: Files
}

/**
 * Defines the Card type, used for type specification when handling cards
 */
type Card = {
    question: string
    alternatives: string[]
    correct: number[]
    source: string
    rating: number
    votes: number[]
    help?: string
    theme?: string
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
 * Defines the PostCardVoteProps type, used for type specification when posting card votes
 */
type PostCardVoteProps = {
    courseID: string
    username: string
    cardID: number
    vote: boolean
}

/**
 * Defines the PostFileProps type, used for type specification when posting files
 */
type PostFileProps = {
    courseID: string
    name: string
    parent?: string
}

/**
 * Defines the Files type, used for type specification when handling files
 */
type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 */
export async function postFile(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { courseID, name, parent } = req.body as PostFileProps

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!courseID || !name) {
            return res.status(400).json({ error: 'Missing required field (courseID, name)' })
        }

        // Generates a new document reference with the courseID and name
        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)

        // Creates the file data object
        const fileData = {
            courseID,
            name
        }

        // Adds the parent field to the file data object if defined
        if (parent !== undefined) {
            // @ts-expect-error
            fileData['parent'] = parent
        }

        // Saves the file data to Firestore
        await fileRef.set(fileData)

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_files`)
        res.status(201).json({ name })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Denies the given card from Firebase, and removes them from the storage
 * 
 * This is relevant when there are duplicate questions, or bad questions that
 * should not be reviewed
 * id: number
 * username: string
 * courseID: number
 * {
 *     id: number
 *     question: string
 *     alternatives: string[]
 *     correct: number[]
 * }
 *
 * or 
 * 
 * id: number
 * username: string
 * courseID: number 
 * [{},{},{}]
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postDenied(req: Request, res: Response) {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { id, username, courseID } = req.body

        // Validates the required fields
        const cards = req.body.cards || req.body

        // Validate the required fields
        if (!username || !courseID || !cards) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Checks the token, and returns a 401 unauthoirzed status code if the token is invalid
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Ensure cards is an array
        const cardArray = Array.isArray(cards) ? cards : [cards]

        // Batch delete the cards
        const batch = db.batch()

        // Iterates over the cards and delete them
        for (const card of cardArray) {
            const { question, alternatives, correct } = card
            if (!question || !alternatives || correct === undefined) {
                return res.status(400).json({ error: 'Invalid card structure' })
            }

            // Finds the document to delete
            const snapshot = await db.collection('Course')
                .where('CourseID', '==', courseID)
                .where('id', '==', id)
                .get()

            // Deletes every card in the batch
            snapshot.forEach((doc: any) => {
                batch.delete(doc.ref)
            })
        }

        // Commits the batch
        await batch.commit()

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with a message indicating the success of the operation
        res.status(200).json({ message: 'Cards denied and removed successfully' })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
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
export async function postCard(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const card = req.body as {
            username: string
            courseID: string
            question: string
            alternatives: string[]
            correct: number[]
        }

        // Validate the required fields
        if (!card.username || !card.courseID || !card.question || !card.alternatives || card.correct === undefined) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Checks the token, and returns a 401 unauthoirzed status code if the token is invalid
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username: card.username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

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

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(card.courseID)

        // Returns a 201 status code with the ID of the uploaded card
        res.status(201).json({ id: cardRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Uploads the given course to storage as a Course object
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postCourse(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, course } = req.body as { username: string, course: Course }

        // Validate the required fields
        if (!username || !course) {
            return res.status(400).json({ error: 'username and course are required' })
        }
        
        // Checks the token, and returns a 401 unauthoirzed status code if the token is invalid
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }
        
        // Checks if the course has an ID field, and returns a 400 status code if it does not
        const courseID = course.id
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        // Generates a document reference with the courseID
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.set(course)

        // Creates root file for the course
        const fileRef = db.collection('Files').doc(`${courseID}:root`)
        await fileRef.set({
            courseID,
            name: 'root',
            content: '',
            files: []
        })
        
        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache('courses')

        // Returns a 201 status code with the ID of the uploaded course
        res.status(201).json({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

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
export async function postLogin(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, password } = req.body as {
            username: string
            password: string
        }

        // Validate the required fields
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' })
        }

        // Fetches the user data from Firestore
        const userDoc = await db.collection('User').doc(username).get()

        // Checks if the user exists, and returns a 404 status code if not
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Extracts the user data from the document
        const userData = userDoc.data()

        // Checks if the user has data, and returns a 404 status code if not
        if (!userData) {
            return res.status(404).json({ error: 'User has no data' })
        }

        // Temporarily disabled till after exams
        // if (userData.password !== password) { 
        //     return res.status(401).json({ error: 'Invalid username or password' })
        // }

        // Generate the token
        const token = generateToken(userDoc.id)

        // Respond with user details and the generated token
        res.json({
            name: `${userData.firstName} ${userData.lastName}`,
            username,
            time: userData.time,
            token,
            solved: userData.solved
        })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Registers a new user
 * Request:
 * username: string
 * password: string
 * firstName: string
 * lastName: string
 *
 * Response:
 * 201 created user
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postRegister(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, password, firstName, lastName } = req.body as {
            username: string
            password: string
            firstName: string
            lastName: string
        }
        
        // Validate the required fields
        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Username, password, first name and last name are required.' })
        }
        
        // Checks if the username is an NTNU email
        const userNameHasNtnu = username.includes('@ntnu.no') || username.includes('@stud.ntnu.no')
        if (!userNameHasNtnu) {
            return res.status(400).json({ error: 'Mail must be an NTNU email' })
        }
        
        // Extracts the id from the username
        const id = username.split('@')[0]

        // Checks if the user already exists
        const userDoc = await db.collection('Users').doc(`${id}`).get()
        if (userDoc.exists) {
            return res.status(409).json({ error: 'User already exists' })
        }

        // Generates a document for the user
        const userRef = db.collection('User').doc(id)

        // Create the user data object
        const user = {
            username: id,
            password,
            firstName,
            lastName,
            position: 0,
            score: 0,
            time: 0,
            solved: []
        }

        // Save the user data to Firestore
        await userRef.set(user)

        // Invalidates the cached socreboard to ensure that the new user is 
        // included. Should be removed once there are more than 100 users since
        // the new user will not be top 100 anyway
        invalidateCache('scoreboard')

        // Respond with a 201 status code and a message indicating the success of the operation
        res.status(201).json({ message: `Created user ${user.username}` })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Posts a comment to the given course
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postComment(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, courseID, cardID, content, parent } = req.body as ReplyProps

        // Validate the required fields
        if (!username || !username || !courseID || typeof cardID != 'number' || !content) {
            return res.status(400).json({ error: 'Missing required field (username, username, courseID, cardID, content)' })
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
        res.status(201).json({ id: commentRef.id, nextID })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Upvotes or downvotes the passed comment
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postVote(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { username, courseID, cardID, commentID, vote } = req.body as VoteProps

        // Validate the required fields
        if (!username || !courseID || typeof cardID !== 'number' || !commentID || vote == null) {
            return res.status(400).json({ error: 'Missing required field (username, courseID, cardID, commentID, vote)' })
        }

        // Fetches the comment document from Firestore
        const commentRef = db.collection('Comment').doc(commentID.toString())
        const commentDoc = await commentRef.get()

        // Checks if the comment exists, and returns a 404 status code if not
        if (!commentDoc.exists) {
            return res.status(404).json({ error: 'Comment not found' })
        }

        // Extracts the comment data from the document and returns a 404 error if the comment has no data
        const commentData = commentDoc.data()
        if (!commentData) {
            return res.status(404).json({ error: 'Comment has no data' })
        }

        // Extracts the votes and rating from the comment data
        const votes = commentData.votes || []
        const existingVoteIndex = votes.findIndex((v: any) => v.username === username)
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
        res.status(200).json({ id: commentRef.id, rating: newRating, votes })
    } catch (err: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Upvotes or downvotes the passed card
 * @param req Request object
 * @param res Response object
 * @returns Status code depending on the outcome of the operation
 */
export async function postCardVote(req: Request, res: Response): Promise<any> {
    // Wrapped in try-catch block to catch and handle errors gracefully
    try {
        // Destructures the relevant variables from the request body
        const { courseID, username, cardID, vote } = req.body as PostCardVoteProps

        // Validate the required fields
        if (!courseID || !username || typeof cardID !== 'number' || vote == null) {
            return res.status(400).json({ error: 'Missing required field (courseID, username, cardID, vote)' })
        }

        // Fetches the course document from Firestore
        const courseRef = db.collection('Course').doc(courseID.toString())
        const courseDoc = await courseRef.get()

        // Checks if the course exists, and returns a 404 status code if not
        if (!courseDoc.exists) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // Extracts the course data from the document and assigns it to the courseData variable
        const courseData = courseDoc.data()

        // Checks if the course has data, and returns a 404 status code if not
        if (!courseData) {
            return res.status(404).json({ error: 'Course has no data' })
        }

        // Checks if the cards field is an array and if the cardID is within the array
        if (!Array.isArray(courseData.cards) || !courseData.cards[cardID]) {
            return res.status(404).json({ error: 'Card not found' })
        }

        // Extracts the votes and rating from the card data
        const votes = courseData.cards[cardID].votes || []
        const existingVoteIndex = votes.findIndex((v: any) => v.username === username)
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

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the ID of the updated card
        res.status(200).json({ id: courseRef.id, rating: newRating, votes })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).json({ error: err.message })
    }
}
