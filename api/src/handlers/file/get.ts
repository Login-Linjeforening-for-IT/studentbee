import { FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db'
import cache from '../../flow'

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    courseID: string
}

/**
 * FileProps type, used for type specification when handling file parameters
 */
type FileProps = {
    courseID: string
    fileID: string
}

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
 * Fetches the file tree for the given course ID
 * @param req Request
 * @param res Response
 */
export async function fileHandler(req: FastifyRequest, res: FastifyReply) {
    // Destructures the courseID and fileID from the request parameters
    const { courseID, fileID } = req.params as FileProps

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
            return ''
        }

        // Returns the file content
        return file
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the file from cache or database and sends it as a response
        const file = await cache(`${courseID}:${fileID}`, fetchFile)
        res.send(file)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}

/**
 * Fetches all cards for the given course
 * @param req Request
 * @param res Response
 */
export async function filesHandler(req: FastifyRequest, res: FastifyReply) {
    // Destructures the courseID from the request parameters
    const { courseID } = req.params as CourseParam

    /**
     * Internal asynchronous function to fetch the files from Firebase
     * @returns void
     */
    async function fetchFiles() {
        // Fetches the files from the 'Files' collection in the database
        const filesSnapshot = await db.collection('Files').where('courseID', '==', courseID).get()

        // Returns an empty array if no files are found
        if (filesSnapshot.empty) {
            return []
        }

        // Maps the files to an array
        const files = filesSnapshot.docs.map((doc) => doc.data()) as Files[]

        // Groups files by name and initializes files by name
        const groupedFiles: { [key: string]: Files[] } = {}
        const filesByName: { [key: string]: Files } = {}

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
        res.send(topLevelFiles)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
