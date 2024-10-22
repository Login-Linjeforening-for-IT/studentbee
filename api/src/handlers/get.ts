// Used for type specification when recieving requests
import { Request, Response } from 'express'

// Imports the database instance, necesarry to persist operations to the database
import db from '../db'

// Imports cache from the flow module, used to cache data
import cache from '../flow'

// Imports dotenv package to access environment variables
import dotenv from 'dotenv'
import config from "../../package.json"

/**
 * Files type, used for type specification when handling files
 */
type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    courseID: string
}

/**
 * UserParam type, used for type specification when handling user parameters
 */
type UserParam = {
    username: string
}

/**
 * GetFileProps type, used for type specification when handling file parameters
 */
type GetFileProps = {
    courseID: string
    fileID: string
}

// Configures the environment variables
dotenv.config()

const { BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL } = process.env

if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !EXAM_URL) {
    throw new Error("Missing one of: BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL")
}

// OAuth2 Endpoints for Authentik
const AUTH_URL = `${BASE_URL}/application/o/authorize/`
const TOKEN_URL = `${BASE_URL}/application/o/token/`
const USERINFO_URL = `${BASE_URL}/application/o/userinfo/`


/**
 * Base information about the api if the route was not specified
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function getIndexHandler(_: Request, res: Response) {
    res.json({ message: "Welcome to the API!\n\nValid endpoints are:\n\n/ - Y" +
    "ou are here, this displays info about the API\n/scoreboard - Returns the" +
    " first 100 users on the scoreboard\n/courses - Returns a list of all cou" +
    "rses\n/courses/:courseID/reviewed - Returns a list of all reviewed flash" + 
    "cards\n/courses/:courseID/cards - Returns all cards, reviewed " +
    "or not\n/user/:username - Returns all info for every user" })
}

/**
 * Health check for the API
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function getHealthHandler(_: Request, res: Response) {
    res.json(200)
}

/**
 * Fetches the first 100 users on the scoreboard from Firebase
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function getScoreboard(_: Request, res: Response) {

    /**
     * Internal asynchronous function to fetch the scoreboard from Firebase
     * @returns The (top 100) users on the scoreboard
     */
    async function fetchScoreboard() {
        // Fetches the users from the 'User' collection in the database
        const snapshot = await db.collection('User')
        .orderBy('score', 'desc')
        .limit(100)
        .get()
        
        // Constructs the scoreboard
        return snapshot.docs.map((doc: any) => ({
            username: doc.id,
            score: doc.data().score,
            solved: doc.data().solved.length,
            time: doc.data().time
        }))
    }
    
    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the scoreboard from cache or database and sends it as a response
        const scoreboard = await cache('scoreboard', fetchScoreboard)
        res.json(scoreboard)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Fetches a list of all courses in the database
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function getCourses(_: Request, res: Response) {
    /**
     * Internal asynchronous function to fetch the courses from Firebase
     * @returns All courses in the database
     */
    async function fetchCourses() {
        // Fetches the courses from the 'Course' collection in the database
        const coursesSnapshot = await db.collection('Course').get()
        
        // Returns the courses with the cards and card count
        return coursesSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            cards: doc.data().cards,
            count: doc.data().cards.length
        }))
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the courses from cache or database and sends it as a response
        const courses = await cache('courses', fetchCourses)
        res.json(courses)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Fetches course by id
 * @param req Request
 * @param res Response
 */
export async function getCourse(req: Request, res: Response) {
    // Destructures the courseID from the request parameters
    const { courseID } = req.params as CourseParam

    /**
     * Internal asynchronous function to fetch the course from Firebase
     * @returns The specifed course from the database if found, or otherwise a string indicating the error
     */
    async function fetchCourse() {
        // Fetches the course from the 'Course' collection database
        const courseSnapshot = await db.collection('Course').doc(courseID).get()
        
        // Returns the course if found, or otherwise a string indicating the error
        if (!courseSnapshot.exists) {
            return 'Course not found'
        }

        // Assigns the data to course if it exists
        const course = courseSnapshot.data()

        // Checks if course has any value, othwerwise returns a string 
        // indicating that the course does not have any data
        if (!course) {
            return 'Course has no data'
        }

        // Returns the course
        return course
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the course from cache or database and sends it as a response
        const course = await cache(courseID, fetchCourse)
        res.json(course)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Fetches the file tree for the given course ID
 * @param req Request
 * @param res Response
 */
export async function getFile(req: Request, res: Response) {
    // Destructures the courseID and fileID from the request parameters
    const { courseID, fileID } = req.params as GetFileProps

    /**
     * Internal asynchronous function to fetch the file from Firebase
     * @returns The specified file from the database if found, or otherwise a string indicating the error
     */
    async function fetchFile() {
        // Fetches the file from the database
        const fileSnapShot = await db.collection('Files').doc(`${courseID}:${fileID}`).get()

        // Returns the file content if found, or otherwise a string indicating the error
        if (!fileSnapShot.exists) {
            return 'File not found'
        }

        // Assigns the data to file if it exists
        const file = fileSnapShot.data()?.content

        // Returns the file content if found, or an empty string if not found
        if (!file) {
           return ""
        }

        // Returns the file content
        return file
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the file from cache or database and sends it as a response
        const file = await cache(`${courseID}:${fileID}`, fetchFile)
        res.json(file)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Fetches all cards for the given course
 * @param req Request 
 * @param res Response
 */
export async function getFiles(req: Request, res: Response) {
    // Destructures the courseID from the request parameters
    const { courseID } = req.params as CourseParam
    
    /**
     * Internal asynchronous function to fetch the files from Firebase
     * @returns 
     */
    async function fetchFiles() {
        // Fetches the files from the 'Files' collection in the database
        const filesSnapshot = await db.collection('Files').where('courseID', '==', courseID).get()

        // Returns an empty array if no files are found
        if (filesSnapshot.empty) {
            return []
        }

        // Maps the files to an array
        const files = filesSnapshot.docs.map((doc: any) => doc.data())

        // Groups files by name and initializes files by name
        const groupedFiles: { [key: string]: any[] } = {}
        const filesByName: { [key: string]: any } = {}

        // Initialize files by name and group files
        files.forEach(file => {
            file.files = []
            // Inserts the file into filesByName
            filesByName[file.name] = file

            // Assigns the file name to fileName, or 'no_fileName' if the file name is not defined
            const fileName = file.name || 'no_fileName'

            // Groups files by name
            if (!groupedFiles[fileName]) {
                groupedFiles[fileName] = []
            }

            // Pushes the file into the groupedFiles array
            groupedFiles[fileName].push(file)
        })

        // Nest files under their parent file
        files.forEach(file => {
            if (file.parent) {
                const parentFile = filesByName[file.parent]
                if (parentFile) {
                    parentFile.files.push(file)
                }
            }
        })

        // Filter out files that are nested, to avoid duplicates in the top-level array
        Object.keys(groupedFiles).forEach(fileName => {
            groupedFiles[fileName] = groupedFiles[fileName].filter(file => !file.parent)
        })

        // Collect all top-level files into a single array
        const topLevelFiles: Files[] = []
        Object.keys(groupedFiles).forEach(fileName => {
            topLevelFiles.push(...groupedFiles[fileName])
        })

        // Returns the top-level files
        return topLevelFiles
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the files from cache or database and sends it as a response
        const topLevelFiles = await cache(`${courseID}_files`, fetchFiles)
        res.json(topLevelFiles)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Fetches the user profile for the given user
 * @param req Request
 * @param res Response
 */
export async function getUserProfile(req: Request, res: Response) {
    // Destructures the username from the request parameters
    const { username } = req.params as UserParam

    /**
     * Internal asynchronous function to fetch the user profile from Firebase
     * @returns The user profile for the specified user if found, or otherwise a string indicating the error
     */
    async function fetchUserProfile() {
        // Fetches the user profile from the 'User' collection in the database
        const userProfileDoc = await db.collection('User').doc(username).get()

        // Returns an error if the user profile is not found
        if (!userProfileDoc.exists) {
            return 'User not found'
        }

        // Assigns the data to data if it exists
        const data = userProfileDoc.data()

        // Returns an error if the user has no data
        if (!data) {
            return 'User has no data'
        }

        // Returns the user profile
        return {
            username,
            name: data.firstName + ' ' + data.lastName,
            score: data.score,
            solved: data.solved,
            time: data.time,
        }
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the user profile from cache or database and sends it as a response
        const userProfile = await cache(`user_${username}`, fetchUserProfile)
        res.json(userProfile)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

/**
 * Fetches all comments for the given course
 * @param req Request
 * @param res Response
 */
export async function getComments(req: Request, res: Response) {
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
        res.json(commentsArray)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Redirects to Authentik for login
export function getLogin(_: Request, res: Response) {
    const state = Math.random().toString(36).substring(5)
    const authQueryParams = new URLSearchParams({
        client_id: CLIENT_ID as string,
        redirect_uri: REDIRECT_URI as string,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
    }).toString()

    res.redirect(`${AUTH_URL}?${authQueryParams}`)
}

/**
 * Callback route to exchange code for token
 * @param req Request
 * @param res Response
 */
export async function getCallback(req: Request, res: Response): Promise<any> {
    const { code } = req.query

    if (!code) {
        return res.status(400).send('No authorization code found.')
    }
    
    try {
        // Exchanges callback code for access token
        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID as string,
                client_secret: CLIENT_SECRET as string,
                code: code as string,
                redirect_uri: REDIRECT_URI as string,
                grant_type: 'authorization_code',
            }).toString()
        })

        const tokenResponseBody = await tokenResponse.text()
     
        if (!tokenResponse.ok) {
            return res.status(500).send(`Failed to obtain token: ${tokenResponseBody}`)
        }

        const token = JSON.parse(tokenResponseBody)

        // Fetches user info using access token
        const userInfoResponse = await fetch(USERINFO_URL, {
            headers: { Authorization: `Bearer ${token.access_token}` }
        })

        if (!userInfoResponse.ok) {
            const userInfoError = await userInfoResponse.text()
            return res.status(500).send(`No user info found: ${userInfoError}`)
        }

        const userInfo = await userInfoResponse.json()

        const redirectUrl = new URL(`${EXAM_URL}/login`)
        const params = new URLSearchParams({
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            groups: userInfo.groups.join(','),
            access_token: token.access_token
        })

        redirectUrl.search = params.toString()
        return res.redirect(redirectUrl.toString())
    } catch (err: unknown) {
        const error = err as Error
        console.error('Error during OAuth2 flow:', error.message)
        return res.status(500).send('Authentication failed')
    }
}

export function getVersion(_: Request, res: Response): any {
    return res.json(config.version)
}