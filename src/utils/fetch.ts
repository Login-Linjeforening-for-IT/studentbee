import { API } from "@parent/constants"

type AddCourseProps = {
    id: string
    course: string
    content: FlashCard[] | string

}

type AddCardProps = {
    user_id: string
    course_id: string
    flashcard: FlashCard
}

type AddTextProps = {
    user_id: string
    course_id: string
    text: string
}

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
export function addCourse({id, course, content}: AddCourseProps) {

}

// Adds a question to the course with the given user id
export function addCard({user_id, course_id, flashcard}: AddCardProps) {
    
}

// Adds a textinput to the course with the given user id
export function addText({user_id, course_id, text}: AddTextProps) {

}