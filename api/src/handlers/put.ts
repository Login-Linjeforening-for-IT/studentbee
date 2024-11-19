// Used for type specification when recieving requests
import { Request, Response } from 'express'

// Imports the database instance, necesarry to persist operations to the database
import db from '../db'

// Imports the invalidateCache function from the flow module, used to invalidate
import { invalidateCache } from '../flow'

/**
 * Editing type, used for type specification when editing courses
 */
type Editing = {
    cards: Card[]
    texts: string[]
}

/**
 * Card type, used for type specification when creating cards
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
 * PutFileProps type, used for type specification when putting files
 */
type PutFileProps = {
    courseID: string
    name: string
    content: string
}

/**
 * Function used to update courses in the database
 * @param req Request object
 * @param res Response objecet
 * @returns Status code based on the outcome of the operation
 */
export async function putCourse(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures the courseID from the request parameters
        const { courseID } = req.params

        // Destructures relevant variables from the request body
        const { username, accepted, editing } = req.body as { username: string, accepted: Card[], editing: Editing }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || accepted === undefined || editing === undefined) {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
        }

        // Checks if the courseID is defined, or otherwise returns a 400 status code
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({
            username,
            cards: accepted,
            unreviewed: editing.cards,
            textUnreviewed: editing.texts
        })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the id of the updated course
        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Function used to update files in the database
 * @param req Request object 
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putFile(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { courseID, name, content } = req.body as PutFileProps

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!courseID || !name || !content) {
            return res.status(400).json({ error: 'Missing required field (courseID, name, content)' })
        }

        // Finds the file in the database and updates it with the new content
        const fileRef = db.collection('Files').doc(`${courseID}:${name}`)
        await fileRef.update({ content })
        
        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}:${name}`)
        invalidateCache(`${courseID}_files`)

        // Returns a 201 status code with the id of the updated file
        res.status(201).json({ id: fileRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Function used to update grades in the database
 * @param req Request object
 * @param res Response objecet
 * @returns Status code based on the outcome of the operation
 */
export async function putGrades(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures the courseID from the request parameters
        const { courseID } = req.params

        // Destructures relevant variables from the request body
        const { year, grades } = req.body as { year: string, grades: object }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (year === undefined || grades === undefined) {
            return res.status(400).json({ error: 'grades and year are required' })
        }

        // Checks if the courseID is defined, or otherwise returns a 400 status code
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        // Finds or create the course in the database and updates it with the grade data
        const gradesRef = db.collection('Grade').doc(courseID)
        await gradesRef.set({
            [year] : grades
        },{ merge: true })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`${courseID}_grades`)

        // Returns a 200 status code with the id of the updated course
        res.status(200).json({ id: gradesRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * // Updates unreviewed course text in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putText(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, courseID, text } = req.body as { username: string, courseID: string, text: string[] }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || !courseID || !text) {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
        }

        // Finds the course in the database and updates it with the new data
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Finds the course in the database and updates it with the new data
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({ username, textUnreviewed: text })

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the id of the updated course
        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Updates user time spent doing courses in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putTime(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, time } = req.body as { username: string, time: number }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || typeof time !== 'number') {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
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
        res.status(200).json({ id: userRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Updates user socre in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putScore(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { username, score } = req.body as { username: string, score: number }
        
        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!username || typeof score !== 'number') {
            return res.status(400).json({ error: 'username, accepted, and editing are required' })
        }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('User').doc(username)
        await courseRef.update({score})

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(`user_${username}`)

        // Returns a 200 status code with the id of the updated course
        res.status(200).json({ id: courseRef.id })
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Updates the mark of a course in the database
 * @param req Request object
 * @param res Response object
 * @returns Status code based on the outcome of the operation
 */
export async function putMarkCourse(req: Request, res: Response): Promise<any> {
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Destructures relevant variables from the request body
        const { courseID, mark } = req.body as { courseID: string, mark: boolean }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (!courseID) {
            return res.status(400).json({ error: 'Course ID is required.' })
        }

        // Checks if required variables are defined, or otherwise returns a 400 status code
        if (typeof mark === undefined || mark === null) {
            return res.status(400).json({ error: 'Mark is required.' })
        }

        // Finds the course in the database and updates it with the new data
        // const error = checkToken({authorizationHeader: req.headers['authorization'], username, verifyToken})
        // if (error) {
        //     return res.status(401).json({ error })
        // }

        // Finds the course in the database and updates it with the new data
        const courseRef = db.collection('Course').doc(courseID)
        await courseRef.update({mark})

        // Invalidates the cache to ensure that the data served is up to date
        invalidateCache(courseID)

        // Returns a 200 status code with the id of the updated course
        res.status(200).json({ id: courseRef.id, mark })
    } catch (error: unknown) {
        // Returns a 500 status code with the error message if an error occured
        const err = error as Error
        res.status(500).json({ error: err.message })   
    }
}
