import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    courseID: string
}

/**
 * Fetches all cards for the given course
 * @param req Request
 * @param res Response
 */
export async function filesHandler(req: FastifyRequest, res: FastifyReply) {
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
