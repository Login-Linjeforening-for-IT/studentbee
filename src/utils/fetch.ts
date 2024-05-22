import { API } from "@parent/constants"

export async function getScoreBoard() {
    const response = await fetch(`${API}/scoreboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const data = await response.json()

        throw Error(data.error)
    }

    return await response.json()
}

export async function getCourses(): Promise<Course[]> {
    const response = await fetch(`${API}/courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const data = await response.json()

        throw Error(data.error)
    }

    return await response.json()
}

// .............................................................................

// Adds a course with the given user id, course name and questions
export function addCourse(course: Course): void | string {
    // get user_id
    return 'not implemented'
}

// Adds a question to the course with the given user id
export function addCard(course_id: string, card: Card): void | string {
    // get user_id
    return 'not implemented'
}

// Adds a textinput to the course with the given user id
export function addText(course_id: string, text: string): void | string {
    // get user_id
    return 'not implemented'
}