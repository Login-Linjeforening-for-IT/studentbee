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
}

type Card = {
    question: string
    alternatives: string[]
    correct: number
    help?: string
}

type Editing = {
    cards: Card[]
    texts: string[]
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
        const scoreboard = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
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
        const courses = coursesSnapshot.docs.map(doc => ({
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

// Fetches the list of cards from the course with the given id
export async function getReviewedCards(req: Request, res: Response) {
    try {
        const { courseID } = req.params

        // Fetches the cards for the given course
        const cardSnapshot = await db.collection('Card')
            .where('courseID', '==', courseID)
            .get()

        // Returns the data
        const cards = cardSnapshot.docs.map(doc => ({id: doc.id,...doc.data()}))

        res.json(cards)
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

// Moves the approved cards from unreviewed to reviewed
// id: number
// userID: number
// courseID: number
// {
//     question: string
//     alternatives: string[]
//     correct: number
// }
//
// or 
//
// courseID: number 
// [{},{},{}]
export async function postApproved(req: Request, res: Response) {
    try {
        const { id, userID, courseID, cards } = req.body

        // Validate the required fields
        if (!userID || !courseID || !cards || !Array.isArray(cards)) {
            return res.status(400).json({ error: 'Missing or invalid required fields' })
        }

        // const error = checkToken({authorizationHeader: req.headers['authorization'], userID: userID, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Batch move the cards
        const batch = db.batch()

        for (const card of cards) {
            const { question, alternatives, correct } = card
            if (!question || !alternatives || correct === undefined) {
                return res.status(400).json({ error: 'Invalid card structure' })
            }

            // Find the document in CardUnreviewed collection
            const snapshot = await db.collection('CardUnreviewed')
                .where('id', '==', id)
                .get()

            snapshot.forEach(doc => {
                // Add the document to the Card collection
                batch.set(db.collection('Card').doc(doc.id), {
                    courseID,
                    question,
                    alternatives,
                    correct
                })

                // Delete the document from CardUnreviewed collection
                batch.delete(doc.ref)
            })
        }

        // Commit the batch
        await batch.commit()

        res.status(200).json({ message: 'Cards moved to reviewed successfully' })
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
//     correct: number
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

            snapshot.forEach(doc => {
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
//     correct: number
// }
export async function postCard(req: Request, res: Response) {
    try {
        const card = req.body as {
            userID: number
            courseID: number
            question: string
            alternatives: string[]
            correct: number
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

// Uploads the given cards to storage as a text string to be reviewed
// userID: number (the id of the user who submitted the question)
// courseID: number (the course the unreviewed question is for)
// input: string
export async function postText(req: Request, res: Response) {
    try {
        const { userID, courseID, text } = req.body as { userID: number, courseID: number, text: string }

        if (!userID || !courseID || !text) {
            return res.status(400).json({ error: 'userID, courseID and text are required' })
        }

        const error = checkToken({authorizationHeader: req.headers['authorization'], userID: userID, verifyToken})
        if (error) {
            return res.status(401).json({ error })
        }

        // Generate a new document reference with an auto-generated ID
        const textRef = db.collection('CardUnreviewedText').doc()

        // Save the text string to Firestore, including the courseID
        await textRef.set({ userID, courseID, text })

        // Return the generated ID as the response
        res.status(201).json({ id: textRef.id })
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

        // Validate the password (In a real application, ensure passwords are hashed and use bcrypt for comparison)
        if (userData.password !== password) { 
            return res.status(401).json({ error: 'Invalid username or password' })
        }

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