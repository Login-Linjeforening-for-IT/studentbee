import { Request, Response } from 'express'
import db from './db'
import dotenv from 'dotenv'
import crypto from 'crypto'

type HandleTokenProps = {
    authorizationHeader: string | undefined
    user_id: number
    verifyToken: (token: string, userId: string) => boolean
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
        const flashcardsSnapshot = await db.collection('FlashCard').get()

        // Fetches the course IDs and the number of flashcards for each course
        const flashcardCounts: { [key: string]: number } = {}
        flashcardsSnapshot.forEach(doc => {
            const courseId = doc.data().course_id
            if (courseId in flashcardCounts) {
                flashcardCounts[courseId]++
            } else {
                flashcardCounts[courseId] = 1
            }
        })

        // Returns the data
        const courses = coursesSnapshot.docs.map(doc => ({
            id: doc.id,
            flashcard_count: flashcardCounts[doc.id] || 0
        }))

        res.json(courses)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches the list of flashcards from the course with the given id
export async function getReviewedFlashcards(req: Request, res: Response) {
    try {
        const { courseId } = req.params

        // Fetches the flashcards for the given course
        const flashcardsSnapshot = await db.collection('FlashCard')
            .where('course_id', '==', courseId)
            .get()

        // Returns the data
        const flashcards = flashcardsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        res.json(flashcards)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches all flashcards from the course with the given id (including unreviewed)
export async function getAllFlashcards(req: Request, res: Response) {
    try {
        const { courseId } = req.params

        // Fetches reviewed flashcards
        const reviewedFlashcardsSnapshot = await db.collection('FlashCard')
            .where('course_id', '==', courseId)
            .get()

        // Fetches unreviewed flashcards (structured)
        const unreviewedFlashcardsSnapshot = await db.collection('FlashCardUnreviewed')
            .where('course_id', '==', courseId)
            .get()

        // Fetches unreviewed text flashcards
        const unreviewedTextFlashcardsSnapshot = await db.collection('FlashCardUnreviewedText')
            .where('course_id', '==', courseId)
            .get()

        // Prepares results
        const reviewedFlashcards = reviewedFlashcardsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        const unreviewedFlashcards = unreviewedFlashcardsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        const unreviewedTextFlashcards = unreviewedTextFlashcardsSnapshot.docs.map(doc => doc.data().text)

        // Returns results grouped by type
        res.json({
            reviewed: reviewedFlashcards,
            unreviewed: unreviewedFlashcards,
            unreviewedText: unreviewedTextFlashcards
        })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches the user profile for the given user
export async function getUserProfile(req: Request, res: Response) {
    try {
        const { userId } = req.params
        const userProfileDoc = await db.collection('User').doc(userId).get()

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

// Moves the approved flashcards from unreviewed to reviewed
// user_id: number
// course_id: number
// {
//     question: string
//     alternatives: string[]
//     correct: number
// }
//
// or 
//
// course_id: number 
// [{},{},{}]
export async function postApproved(req: Request, res: Response) {
    try {
        const { user_id, course_id, flashcards } = req.body;

        // Validate the required fields
        if (!user_id || !course_id || !flashcards || !Array.isArray(flashcards)) {
            return res.status(400).json({ error: 'Missing or invalid required fields' });
        }

        const error = checkToken({authorizationHeader: req.headers['authorization'], user_id: user_id, verifyToken})
        if (error) {
            res.status(401).json({ error });
        }

        // Batch move the flashcards
        const batch = db.batch();

        for (const flashcard of flashcards) {
            const { question, alternatives, correct } = flashcard;
            if (!question || !alternatives || correct === undefined) {
                return res.status(400).json({ error: 'Invalid flashcard structure' });
            }

            // Find the document in FlashCardUnreviewed collection
            const snapshot = await db.collection('FlashCardUnreviewed')
                .where('course_id', '==', course_id)
                .where('question', '==', question)
                .where('alternatives', 'array-contains-any', alternatives)
                .where('correct', '==', correct)
                .get();

            snapshot.forEach(doc => {
                // Add the document to the FlashCard collection
                batch.set(db.collection('FlashCard').doc(doc.id), {
                    course_id,
                    question,
                    alternatives,
                    correct
                });

                // Delete the document from FlashCardUnreviewed collection
                batch.delete(doc.ref);
            });
        }

        // Commit the batch
        await batch.commit();

        res.status(200).json({ message: 'Flashcards moved to reviewed successfully' });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
}

// Denies the given flashcard from Firebase, and removes them from the storage
// This is relevant when there are duplicate questions, or bad questions that
// should not be reviewed
// user_id: number
// course_id: number
// {
//     question: string
//     alternatives: string[]
//     correct: number
// }
//
// or 
//
// user_id: number
// course_id: number 
// [{},{},{}]
export async function postDenied(req: Request, res: Response) {
    try {
        const { user_id, course_id } = req.body;
        const flashcards = req.body.flashcards || req.body;

        // Validate the required fields
        if (!user_id || !course_id || !flashcards) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const error = checkToken({authorizationHeader: req.headers['authorization'], user_id: user_id, verifyToken})
        if (error) {
            res.status(401).json({ error });
        }

        // Ensure flashcards is an array
        const flashcardArray = Array.isArray(flashcards) ? flashcards : [flashcards];

        // Batch delete the flashcards
        const batch = db.batch();

        for (const flashcard of flashcardArray) {
            const { question, alternatives, correct } = flashcard;
            if (!question || !alternatives || correct === undefined) {
                return res.status(400).json({ error: 'Invalid flashcard structure' });
            }

            // Find the document to delete
            const snapshot = await db.collection('FlashCardUnreviewed')
                .where('user_id', '==', user_id)
                .where('course_id', '==', course_id)
                .where('question', '==', question)
                .where('alternatives', 'array-contains-any', alternatives)
                .where('correct', '==', correct)
                .get();

            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
        }

        // Commit the batch
        await batch.commit();

        res.status(200).json({ message: 'Flashcards denied and removed successfully' });
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
}

// Uploads the given flashcards to storage as a struct (a unreviewed flashcard struct directly)
// user_id: number(the user id)
// token: string (user token)
// course_id: number (the course the unreviewed question is for)
// {
//     question: string
//     alternatives: string[]
//     correct: number
// }
export async function postUploadedAsStruct(req: Request, res: Response) {
    try {
        const flashcard = req.body as {
            user_id: number
            course_id: number
            question: string
            alternatives: string[]
            correct: number
        }

        // Validate the required fields
        if (!flashcard.user_id || !flashcard.course_id || !flashcard.question || !flashcard.alternatives || flashcard.correct === undefined) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const error = checkToken({authorizationHeader: req.headers['authorization'], user_id: flashcard.user_id, verifyToken})
        if (error) {
            res.status(401).json({ error });
        }

        // Generate a new document reference with an auto-generated ID
        const flashcardRef = db.collection('FlashCardUnreviewed').doc()

        // Save the flashcard data to Firestore, including the course_id
        await flashcardRef.set({
            user_id: flashcard.user_id,
            course_id: flashcard.course_id,
            question: flashcard.question,
            alternatives: flashcard.alternatives,
            correct: flashcard.correct
        })

        // Return the generated ID as the response
        res.status(201).json({ id: flashcardRef.id })
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Uploads the given flashcards to storage as a text string to be reviewed
// user_id: number (the id of the user who submitted the question)
// course_id: number (the course the unreviewed question is for)
// input: string
export async function postUploadedAsText(req: Request, res: Response) {
    try {
        const { user_id, course_id, text } = req.body as { user_id: number, course_id: number, text: string }

        if (!user_id || !course_id || !text) {
            return res.status(400).json({ error: 'user_id, course_id and text are required' })
        }

        const error = checkToken({authorizationHeader: req.headers['authorization'], user_id: user_id, verifyToken})
        if (error) {
            res.status(401).json({ error });
        }

        // Generate a new document reference with an auto-generated ID
        const textRef = db.collection('FlashCardUnreviewedText').doc()

        // Save the text string to Firestore, including the course_id
        await textRef.set({ user_id, course_id, text })

        // Return the generated ID as the response
        res.status(201).json({ id: textRef.id })
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
            return res.status(400).json({ error: 'All fields are required' })
        }

        // Check if the username already exists
        const existingUserSnapshot = await db.collection('User').where('username', '==', username).get()
        if (!existingUserSnapshot.empty) {
            return res.status(409).json({ error: 'Username already exists' })
        }

        // Generate a new document reference with an auto-generated ID
        const userRef = db.collection('User').doc()

        // Create the user data object
        const user = {
            id: userRef.id,
            username,
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

// Base information about the api if the route was not specified
export async function getIndexHandler(_: Request, res: Response) {
    res.json({ message: "Welcome to the API!\n\nValid endpoints are:\n\n/ - Y" +
    "ou are here, this displays info about the API\n/scoreboard - Returns the" +
    " first 100 users on the scoreboard\n/courses - Returns a list of all cou" +
    "rses\n/courses/:courseId/reviewed - Returns a list of all reviewed flash" + 
    "cards\n/courses/:courseId/flashcards - Returns all flashcards, reviewed " +
    "or not\n/users/:userId - Returns all info for every user" })
}

// Generates a token for the given user ID
function generateToken(id: string): string {
    const timestamp = Date.now()
    const data = `${id}:${timestamp}:${BACKEND_SECRET}`
    return crypto.createHash('sha256').update(data).digest('hex')
}

// Verifies that the passed token is valid for the given user
function verifyToken(token: string, userId: string): boolean {
    const tokenParts = token.split(':');
    if (tokenParts.length !== 2) return false;

    const [id, timestamp] = tokenParts;
    const data = `${userId}:${timestamp}:${BACKEND_SECRET}`;
    const expectedToken = crypto.createHash('sha256').update(data).digest('hex');

    return expectedToken === token;
}

// Checks the token and returns an error message if the token is invalid
function checkToken({authorizationHeader, user_id, verifyToken}: HandleTokenProps): boolean | string  {
    if (!authorizationHeader) {
        return 'Authorization header missing'
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        return 'Token missing from authorization header'
    }

    if (!verifyToken(token, user_id.toString())) {
        return 'Invalid token'
    }

    return true
}