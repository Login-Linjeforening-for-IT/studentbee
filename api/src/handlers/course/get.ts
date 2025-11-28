import type { FastifyReply, FastifyRequest } from 'fastify'
import db from '#db'

/**
 * CourseParam type, used for type specification when handling course parameters
 */
type CourseParam = {
    courseID: string
}

/**
 * Fetches a list of all courses in the database
 * @param _ Request, not used
 * @param res Response, used to send the response to the user
 */
export async function coursesHandler(_: FastifyRequest, res: FastifyReply) {
    /**
     * Internal asynchronous function to fetch the courses from Firebase
     * @returns All courses in the database
     */
    async function fetchCourses() {
        // Fetches the courses from the 'Course' collection in the database
        const coursesSnapshot = await db.collection('Course').get()

        // Returns the courses with the cards and card count
        return coursesSnapshot.docs.map((doc) => ({
            id: doc.id,
            cards: doc.data().cards,
            count: doc.data().cards.length
        }))
    }

    // Wrapped in a try-catch block to handle potential errors gracefully
    try {
        // Fetches the courses from cache or database and sends it as a response
        const courses = await cache('courses', fetchCourses)
        res.send(courses)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}

/**
 * Fetches course by id
 * @param req Request
 * @param res Response
 */
export async function courseHandler(req: FastifyRequest, res: FastifyReply) {
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
        res.send(course)
    } catch (err) {
        // Returns a 500 status code with the error message if an error occured
        const error = err as Error
        res.status(500).send({ error: error.message })
    }
}
