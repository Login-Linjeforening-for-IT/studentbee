import { Request, Response } from 'express'
import db from '../db'
import { generateToken } from '../manager'
import cache, { invalidateCache } from '../flow'

type Course = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    textUnreviewed: string[]
    files: Files
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

type PostFileProps = {
    courseID: string
    name: string
    parent?: string
}

type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

export async function postFile(req: Request, res: Response) {
    try {
        const { courseID, name, parent } = req.body as PostFileProps

        if (!courseID || !name) {
            return res.status(400).json({ error: 'Missing required field (courseID, name)' })
        }

        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)

        const fileData = {
            courseID,
            name
        }

        if (parent !== undefined) {
            // @ts-expect-error
            fileData['parent'] = parent
        }

        await fileRef.set(fileData)

        invalidateCache(`${courseID}_files`)
        res.status(201).json({ name })
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

        invalidateCache(courseID)
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
            courseID: string
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

        invalidateCache(card.courseID)
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

        const fileRef = db.collection('Files').doc(`${courseID}:root`)
        await fileRef.set({
            courseID,
            name: 'root',
            content: '',
            files: []
        })

        invalidateCache('courses')
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

        invalidateCache('scoreboard')
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

        invalidateCache(`${courseID}_comments`)
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

        invalidateCache(`${courseID}_comments`)
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

        invalidateCache(courseID)
        res.status(200).json({ id: courseRef.id, rating: newRating, votes })
    } catch (error: unknown) {
        const err = error as Error
        res.status(500).json({ error: err.message })
    }
}