import { Request, Response } from 'express'
import db from './db'
import dotenv from 'dotenv'
import crypto from 'crypto'

type HandleTokenProps = {
    authorizationHeader: string | undefined
    userID: number
    verifyToken: (token: string, userID: string) => boolean
}

type Course = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    textUnreviewed: string[]
    files: Files
}

type Files = {
    name: string
    content: InnerFile[] | string[]
}

type InnerFile = {
    name: string
    content: string[]
}

type Editing = {
    cards: Card[]
    texts: string[]
}

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

type ReplyProps = {
    userID: string
    username: string
    courseID: string
    cardID: number
    commentID: number
    content: string
    parent?: number
}

type VoteProps = {
    userID: string
    courseID: string
    cardID: number
    commentID: number
    vote: boolean
}

type PostCardVoteProps = {
    courseID: string
    userID: string
    cardID: number
    vote: boolean
}

dotenv.config()

const { BACKEND_SECRET } = process.env

if (!BACKEND_SECRET) {
    throw new Error('BACKEND_SECRET is not defined in the environment variables.')
}

// Fetches the first 100 users on the scoreboard from Firebase
export async function getScoreboard(_: Request, res: Response) {
    try {
        // Fetches the users
        const snapshot = await db.collection('User')
            .orderBy('score', 'desc')
            .limit(100)
            .get()

        // Constructs the scoreboard
        const scoreboard = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            score: doc.data().score,
            solved: doc.data().solved.length,
            username: doc.data().username,
            time: doc.data().time
        }))

        res.json(scoreboard)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches a list of all courses in the database
export async function getCourses(_: Request, res: Response) {
    try {
        const coursesSnapshot = await db.collection('Course').get()

        // Returns the courses with the cards and card count
        const courses = coursesSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            cards: doc.data().cards,
            count: doc.data().cards.length
        }))

        res.json(courses)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches course by id
export async function getCourse(req: Request, res: Response) {
    try {
        const { courseID } = req.params

        // Fetch course by id from firebase
        const courseSnapshot = await db.collection('Course').doc(courseID).get()
        
        if (!courseSnapshot.exists) {
            return res.status(404).json({ error: 'Course not found' })
        }

        const course = courseSnapshot.data()

        if (!course) {
            return res.status(404).json({ error: 'Course has no data' })
        }

        res.json(course)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches the file tree for the given course ID
export async function getFile(req: Request, res: Response) {
    try {
        const { fileID } = req.params
        
        const fileSnapShot = await db.collection('Files').doc(fileID).get()

        if (!fileSnapShot.exists) {
            return res.status(404).json({ error: 'File not found' })
        }

        const file = fileSnapShot.data()?.content

        if (!file) {
            return res.json("")
        }

        res.json(file)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function getFiles(req: Request, res: Response) {
    try {
        const { courseID } = req.params

        if (!courseID) {
            return res.status(400).json({ error: 'Missing required field (courseID)' })
        }

        const filesSnapshot = await db.collection('Files').where('courseID', '==', courseID).get()

        if (filesSnapshot.empty) {
            res.json([])
        }

        const files = filesSnapshot.docs.map((doc: any) => {            
            return {
                id: doc.id,
                name: doc.data().name
            }
        })

        res.json(files)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches the user profile for the given user
export async function getUserProfile(req: Request, res: Response) {
    try {
        const { userID } = req.params
        const userProfileDoc = await db.collection('User').doc(userID).get()

        if (!userProfileDoc.exists) {
            return res.status(404).json({ error: 'User not found' })
        }

        const userProfile = {
            id: userProfileDoc.id,
            ...userProfileDoc.data()
        }

        res.json(userProfile)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches all comments for the given course
export async function getComments(req: Request, res: Response) {
    try {
        const { courseID } = req.params
        const commentsSnapshot = await db.collection('Comment')
            .where('courseID', '==', courseID)
            .get()

        const comments = commentsSnapshot.docs.map((doc: any) => doc.data())

        // Groups comments by cardID and initialize replies array
        const groupedComments: { [key: string]: any[] } = {}
        const commentById: { [key: string]: any } = {}

        comments.forEach(comment => {
            comment.replies = []
            commentById[comment.id] = comment

            const cardID = comment.cardID || 'no_cardID'
            if (!groupedComments[cardID]) {
                groupedComments[cardID] = []
            }
            groupedComments[cardID].push(comment)
        })

        // Nest replies under their parent comments
        comments.forEach(comment => {
            if (comment.parent) {
                const parentComment = commentById[comment.parent]
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
        const commentsArray = Object.keys(groupedComments).map(cardID => groupedComments[cardID])

        res.json(commentsArray)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function postFile(req: Request, res: Response) {
    try {
        const { courseID, name, parent } = req.body as { courseID: string, name: string, parent?: string }

        if (!courseID || !name) {
            return res.status(400).json({ error: 'Missing required field (courseID, name)' })
        }

        const idDocRef = db.collection('Metadata').doc('fileIDCounter')

        const nextID = await db.runTransaction(async (transaction) => {
            const idDocSnapshot = await transaction.get(idDocRef)

            if (!idDocSnapshot.exists) {
                transaction.set(idDocRef, { nextID: 1 }) 
                return 0
            }

            const currentID = idDocSnapshot.data()!.nextID
            transaction.update(idDocRef, { nextID: currentID + 1 })
            return currentID
        })

        const fileRef = db.collection('Files').doc(nextID.toString())

        const FileData = {
            id: nextID,
            courseID,
            name
        }

        if (parent !== undefined) {
            // @ts-expect-error
            commentData['parent'] = parent
        }

        await fileRef.set(FileData)

        // Respond with the ID of the newly created comment
        res.status(201).json({ id: fileRef.id, nextID })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putFile(req: Request, res: Response) {
    try {
        const { courseID, fileID, content } = req.body as { courseID: string, fileID: string, content: string }

        if (!courseID || !fileID || !content) {
            return res.status(400).json({ error: 'Missing required field (courseID, fileID, content)' })
        }

        const fileRef = db.collection('Files').doc(fileID)
        await fileRef.update({ content })

        // Respond with the ID of the newly created comment
        res.status(201).json({ id: fileRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Denies the given card from Firebase, and removes them from the storage
// This is relevant when there are duplicate questions, or bad questions that
// should not be reviewed
// id: number
// userID: number
// courseID: number
// {
//     id: number
//     question: string
//     alternatives: string[]
//     correct: number[]
// }
//
// or 
// 
// id: number
// userID: number
// courseID: number 
// [{},{},{}]
export async function postDenied(req: Request, res: Response) {
    try {
        const { id, userID, courseID } = req.body
        const cards = req.body.cards || req.body

        // Validate the required fields
        if (!userID || !courseID || !cards) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID: userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Ensure cards is an array
        const cardArray = Array.isArray(cards) ? cards : [cards]

        // Batch delete the cards
        const batch = db.batch()

        for (const card of cardArray) {
            const { question, alternatives, correct } = card
            if (!question || !alternatives || correct === undefined) {
                return res.status(400).json({ error: 'Invalid card structure' })
            }

            // Find the document to delete
            const snapshot = await db.collection('CardUnreviewed')
                .where('id', '==', id)
                .get()

            snapshot.forEach((doc: any) => {
                batch.delete(doc.ref)
            })
        }

        // Commit the batch
        await batch.commit()

        res.status(200).json({ message: 'Cards denied and removed successfully' })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Uploads the given cards to storage as a struct (a unreviewed card struct directly)
// userID: number(the user id)
// token: string (user token)
// courseID: number (the course the unreviewed question is for)
// {
//     question: string
//     alternatives: string[]
//     correct: number[]
// }
export async function postCard(req: Request, res: Response) {
    try {
        const card = req.body as {
            userID: number
            courseID: number
            question: string
            alternatives: string[]
            correct: number[]
        }

        // Validate the required fields
        if (!card.userID || !card.courseID || !card.question || !card.alternatives || card.correct === undefined) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID: card.userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Generate a new document reference with an auto-generated ID
        const cardRef = db.collection('CardUnreviewed').doc()

        // Save the card data to Firestore, including the courseID
        await cardRef.set({
            userID: card.userID,
            courseID: card.courseID,
            question: card.question,
            alternatives: card.alternatives,
            correct: card.correct
        })

        // Return the generated ID as the response
        res.status(201).json({ id: cardRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Uploads the given course to storage as a Course object
export async function postCourse(req: Request, res: Response) {
    try {
        const { userID, course } = req.body as { userID: number, course: Course }

        if (!userID || !course) {
            return res.status(400).json({ error: 'userID and course are required' })
        }
        
        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }
        
        const courseID = course.id
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.set(course)
        res.status(201).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Logs in the user
// Request:
// username: string
// password: string
//
// Response:
// id: number
// name: string
// token: string (the api needs to keep track of tokens for each user and encrypt these)
export async function postLogin(req: Request, res: Response) {
    try {
        const { username, password } = req.body as {
            username: string
            password: string
        }

        // Validate the required fields
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' })
        }

        // Fetch the user data from Firestore
        const userSnapshot = await db.collection('User').where('username', '==', username).get()
        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found' })
        }

        const userDoc = userSnapshot.docs[0]
        const userData = userDoc.data()

        // Temporarily disabled till after exams
        // if (userData.password !== password) { 
        //     return res.status(401).json({ error: 'Invalid username or password' })
        // }

        // Generate the token
        const token = generateToken(userDoc.id)

        // Respond with user details and the generated token
        res.json({
            id: userDoc.id,
            name: `${userData.firstName} ${userData.lastName}`,
            username,
            time: userData.time,
            token
        })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Registers a new user
// Request:
// username: string
// password: string
// firstName: string
// lastName: string
//
// Response:
// 201 created user
export async function postRegister(req: Request, res: Response) {
    try {
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

        const userNameHasNtnu = username.includes('@ntnu.no') || username.includes('@stud.ntnu.no')
        if (!userNameHasNtnu) {
            return res.status(400).json({ error: 'Mail must be an NTNU email' })
        }

        // Check if the username already exists
        const existingUserSnapshot = await db.collection('User').where('username', '==', username.split('@')[0]).get()
        if (!existingUserSnapshot.empty) {
            return res.status(409).json({ error: 'Username already exists' })
        }

        // Get the next available numeric ID
        const idDoc = db.collection('Metadata').doc('userIDCounter')
        const idDocSnapshot = await idDoc.get()

        if (!idDocSnapshot.exists) {
            await idDoc.set({ nextID: 1 })
        }

        const nextID = idDocSnapshot.exists ? idDocSnapshot.data()!.nextID : 1

        // Increment the counter for the next user
        await idDoc.update({ nextID: nextID + 1 })

        // Generate a new document reference with the incrementing numeric ID
        const userRef = db.collection('User').doc(nextID.toString())

        // Create the user data object
        const user = {
            id: nextID,
            username: username.split('@')[0],
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

        // Return the created user information
        res.status(201).json({ message: `Created user ${user.id}` })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Posts a comment to the given course
export async function postComment(req: Request, res: Response) {
    try {
        const { userID, username, courseID, cardID, content, parent } = req.body as ReplyProps

        if (!userID || !username || !courseID || typeof cardID != 'number' || !content) {
            return res.status(400).json({ error: 'Missing required field (userID, username, courseID, cardID, content)' })
        }

        const idDocRef = db.collection('Metadata').doc('commentIDCounter')

        const nextID = await db.runTransaction(async (transaction) => {
            const idDocSnapshot = await transaction.get(idDocRef)

            if (!idDocSnapshot.exists) {
                transaction.set(idDocRef, { nextID: 1 }) 
                return 0
            }

            const currentID = idDocSnapshot.data()!.nextID
            transaction.update(idDocRef, { nextID: currentID + 1 })
            return currentID
        })

        const commentRef = db.collection('Comment').doc(nextID.toString())

        const commentData = {
            id: nextID,
            courseID,
            cardID,
            content,
            userID,
            username,
            time: new Date().toISOString(),
            rating: 0,
            voters: []
        }

        if (parent !== undefined) {
            // @ts-expect-error
            commentData['parent'] = parent
        }

        await commentRef.set(commentData)

        // Respond with the ID of the newly created comment
        res.status(201).json({ id: commentRef.id, nextID })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Upvotes or downvotes the passed comment
export async function postVote(req: Request, res: Response) {
    try {
        const { userID, courseID, cardID, commentID, vote } = req.body as VoteProps

        if (!userID || !courseID || typeof cardID !== 'number' || !commentID || vote == null) {
            return res.status(400).json({ error: 'Missing required field (courseID, cardID, commentID, vote)' })
        }

        const commentRef = db.collection('Comment').doc(commentID.toString())
        const commentDoc = await commentRef.get()

        if (!commentDoc.exists) {
            return res.status(404).json({ error: 'Comment not found' })
        }

        const commentData = commentDoc.data()
        if (!commentData) {
            return res.status(404).json({ error: 'Comment has no data' })
        }

        const votes = commentData.votes || []
        const existingVoteIndex = votes.findIndex((v: any) => v.userID === userID)
        let newRating = commentData.rating || 0

        if (existingVoteIndex >= 0) {
            const existingVote = votes[existingVoteIndex].vote

            if (existingVote === vote) {
                votes.splice(existingVoteIndex, 1)
                newRating += vote ? -1 : 1
            } else {
                votes[existingVoteIndex].vote = vote
                newRating += vote ? 2 : -2
            }
        } else {
            votes.push({ userID, vote })
            newRating += vote ? 1 : -1
        }

        await commentRef.update({ votes, rating: newRating })

        res.status(200).json({ id: commentRef.id, rating: newRating, votes })
    } catch (err: unknown) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Upvotes or downvotes the passed card
export async function postCardVote(req: Request, res: Response) {
    try {
        const { courseID, userID, cardID, vote } = req.body as PostCardVoteProps

        if (!courseID || !userID || typeof cardID !== 'number' || vote == null) {
            return res.status(400).json({ error: 'Missing required field (courseID, userID, cardID, vote)' })
        }

        const courseRef = db.collection('Course').doc(courseID.toString())
        const courseDoc = await courseRef.get()

        if (!courseDoc.exists) {
            return res.status(404).json({ error: 'Course not found' })
        }

        const courseData = courseDoc.data()

        if (!courseData) {
            return res.status(404).json({ error: 'Course has no data' })
        }

        if (!Array.isArray(courseData.cards) || !courseData.cards[cardID]) {
            return res.status(404).json({ error: 'Card not found' })
        }

        const votes = courseData.cards[cardID].votes || []
        const existingVoteIndex = votes.findIndex((v: any) => v.userID === userID)
        let newRating = courseData.cards[cardID].rating || 0

        if (existingVoteIndex >= 0) {
            const existingVote = votes[existingVoteIndex].vote

            if (existingVote === vote) {
                votes.splice(existingVoteIndex, 1)
                newRating += vote ? -1 : 1
            } else {
                votes[existingVoteIndex].vote = vote
                newRating += vote ? 2 : -2
            }
        } else {
            votes.push({ userID, vote })
            newRating += vote ? 1 : -1
        }

        const updatedCards = [...courseData.cards]
        updatedCards[cardID] = {
            ...updatedCards[cardID],
            votes,
            rating: newRating
        }

        await courseRef.update({ cards: updatedCards })

        res.status(200).json({ id: courseRef.id, rating: newRating, votes })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })
    }
}

export async function putCourse(req: Request, res: Response) {
    try {
        const { courseID } = req.params
        const { userID, accepted, editing } = req.body as { userID: number, accepted: Card[], editing: Editing }
        
        if (!userID || accepted === undefined || editing === undefined) {
            return res.status(400).json({ error: 'userID, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({
            userID,
            cards: accepted,
            unreviewed: editing.cards,
            textUnreviewed: editing.texts
        })

        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putText(req: Request, res: Response) {
    try {
        const { userID, courseID, text } = req.body as { userID: number, courseID: string, text: string[] }
        
        if (!userID || !courseID || !text) {
            return res.status(400).json({ error: 'userID, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ userID, textUnreviewed: text })

        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putTime(req: Request, res: Response) {
    try {
        const { userID, time } = req.body as { userID: string, time: number }
        
        if (!userID || typeof time !== 'number') {
            return res.status(400).json({ error: 'userID, accepted, and editing are required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const courseRef = db.collection('User').doc(userID)
        await courseRef.update({time})

        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function putMarkCourse(req: Request, res: Response) {
    try {
        const { courseID, mark } = req.body as { courseID: string, mark: boolean }

        
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        if (typeof mark === undefined || mark === null) {
            return res.status(400).json({ error: 'Mark is required.' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({mark})

        res.status(200).json({ id: courseRef.id, mark })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })   
    }
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const { userID, commentID } = req.body

        if (!userID || typeof commentID !== 'number') {
            return res.status(400).json({ error: 'Comment ID is required' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        const commentRef = db.collection('Comment').doc(commentID.toString())
        await commentRef.delete()

        const repliesSnapshot = await db.collection('Comment').where('parent', '==', commentID).get()
        const batch = db.batch()

        repliesSnapshot.forEach(doc => {
            batch.delete(doc.ref)
        })

        res.status(200).json({ id: commentRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Base information about the api if the route was not specified
export async function getIndexHandler(_: Request, res: Response) {
    res.json({ message: "Welcome to the API!\n\nValid endpoints are:\n\n/ - Y" +
    "ou are here, this displays info about the API\n/scoreboard - Returns the" +
    " first 100 users on the scoreboard\n/courses - Returns a list of all cou" +
    "rses\n/courses/:courseID/reviewed - Returns a list of all reviewed flash" + 
    "cards\n/courses/:courseID/cards - Returns all cards, reviewed " +
    "or not\n/users/:userID - Returns all info for every user" })
}

// Generates a token for the given user ID
function generateToken(id: string): string {
    const timestamp = Date.now()
    const data = `${id}:${timestamp}:${BACKEND_SECRET}`
    const hash = crypto.createHash('sha256').update(data).digest('hex')
    const tokenData = `${id}:${timestamp}:${hash}`
    const base64Token = Buffer.from(tokenData).toString('base64')
    return base64Token
}

// Verifies that the passed token is valid for the given user
function verifyToken(token: string, userID: string): boolean {
    const tokenData = Buffer.from(token, 'base64').toString('ascii')
    const tokenParts = tokenData.split(':')
    if (tokenParts.length !== 3) return false

    const [id, timestamp, hash] = tokenParts

    // Ensure the id in the token matches the provided userID
    if (id !== userID) return false

    const data = `${id}:${timestamp}:${BACKEND_SECRET}`
    const expectedHash = crypto.createHash('sha256').update(data).digest('hex')

    return expectedHash === hash
}

// Checks the token and returns an error message if the token is invalid
function checkToken({authorizationHeader, userID, verifyToken}: HandleTokenProps): boolean | string  {
    if (!authorizationHeader) {
        return 'Authorization header missing'
    }

    const token = authorizationHeader.split(' ')[1]
    if (!token) {
        return 'Token missing from authorization header'
    }

    if (!verifyToken(token, userID.toString())) {
        return 'Invalid token'
    }

    return true
}