import { Request, Response } from 'express'
import db from '../db'
import cache, { invalidateCache } from '../flow'

type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

type CourseParam = {
    courseID: string
}

type UserParam = {
    username: string
}

type GetFileProps = {
    courseID: string
    fileID: string
}

// Base information about the api if the route was not specified
export async function getIndexHandler(_: Request, res: Response) {
    res.json({ message: "Welcome to the API!\n\nValid endpoints are:\n\n/ - Y" +
    "ou are here, this displays info about the API\n/scoreboard - Returns the" +
    " first 100 users on the scoreboard\n/courses - Returns a list of all cou" +
    "rses\n/courses/:courseID/reviewed - Returns a list of all reviewed flash" + 
    "cards\n/courses/:courseID/cards - Returns all cards, reviewed " +
    "or not\n/user/:username - Returns all info for every user" })
}

// Fetches the first 100 users on the scoreboard from Firebase
export async function getScoreboard(_: Request, res: Response) {

    async function fetchScoreboard() {
        // Fetches the users
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
    
    try {
        const scoreboard = await cache('scoreboard', fetchScoreboard)
        res.json(scoreboard)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches a list of all courses in the database
export async function getCourses(_: Request, res: Response) {
    async function fetchCourses() {
        const coursesSnapshot = await db.collection('Course').get()

        // Returns the courses with the cards and card count
        return coursesSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            cards: doc.data().cards,
            count: doc.data().cards.length
        }))
    }

    try {
        const courses = await cache('courses', fetchCourses)
        res.json(courses)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches course by id
export async function getCourse(req: Request, res: Response) {
    const { courseID } = req.params as CourseParam

    async function fetchCourse() {
        const courseSnapshot = await db.collection('Course').doc(courseID).get()
        
        if (!courseSnapshot.exists) {
            return 'Course not found'
        }

        const course = courseSnapshot.data()

        if (!course) {
            return 'Course has no data'
        }

        return course
    }

    try {
        const course = await cache(courseID, fetchCourse)
        res.json(course)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches the file tree for the given course ID
export async function getFile(req: Request, res: Response) {
    const { courseID, fileID } = req.params as GetFileProps

    async function fetchFile() {
        const fileSnapShot = await db.collection('Files').doc(`${courseID}:${fileID}`).get()

        if (!fileSnapShot.exists) {
            return 'File not found'
        }

        const file = fileSnapShot.data()?.content

        if (!file) {
           return ""
        }

        return file
    }

    try {
        const file = await cache(`${courseID}:${fileID}`, fetchFile)
        res.json(file)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

export async function getFiles(req: Request, res: Response) {
    const { courseID } = req.params as CourseParam
    
    async function fetchFiles() {
        const filesSnapshot = await db.collection('Files').where('courseID', '==', courseID).get()

        if (filesSnapshot.empty) {
            return []
        }

        const files = filesSnapshot.docs.map((doc: any) => doc.data())

        const groupedFiles: { [key: string]: any[] } = {}
        const filesByName: { [key: string]: any } = {}

        // Initialize files by name and group files
        files.forEach(file => {
            file.files = []
            filesByName[file.name] = file

            const fileName = file.name || 'no_fileName'
            if (!groupedFiles[fileName]) {
                groupedFiles[fileName] = []
            }
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

        return topLevelFiles
    }


    try {
        const topLevelFiles = await cache(`${courseID}_files`, fetchFiles)
        res.json(topLevelFiles)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches the user profile for the given user
export async function getUserProfile(req: Request, res: Response) {
    const { username } = req.params as UserParam

    async function fetchUserProfile() {
        const userProfileDoc = await db.collection('User').doc(username).get()

        if (!userProfileDoc.exists) {
            return 'User not found'
        }

        const data = userProfileDoc.data()

        if (!data) {
            return 'User has no data'
        }

        return {
            name: data.firstName + ' ' + data.lastName,
            username,
            score: data.score,
            solved: data.solved,
            time: data.time,
        }
    }

    try {
        const userProfile = await cache(`user_${username}`, fetchUserProfile)
        res.json(userProfile)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}

// Fetches all comments for the given course
export async function getComments(req: Request, res: Response) {
    const { courseID } = req.params as CourseParam
        
    async function fetchComments() {
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
        return Object.keys(groupedComments).map(cardID => groupedComments[cardID])
    }

    try {
        const commentsArray = await cache(`${courseID}_comments`, fetchComments)
        res.json(commentsArray)
    } catch (err) {
        const error = err as Error
        res.status(500).json({ error: error.message })
    }
}
