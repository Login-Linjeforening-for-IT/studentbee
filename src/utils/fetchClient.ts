'use client'

import { BROWSER_API } from "@parent/constants"
import getCookie from "./cookies"

type MarkProps = {
    courseID: string
    mark: boolean
}

// Adds a course with the given user id, course name and questions
export async function addCourse(course: Course): Promise<void | string> {
    const user: User | undefined = getCookie('user') as User | undefined
    const token = getCookie('token')

    try {
        if (user) {
            const response = await fetch(`${BROWSER_API}/upload_course`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userID: user.id,
                    course
                }),
            })
        
            if (!response.ok) {
                const data = await response.json()
        
                throw Error(data.error)
            }
    
            const result = response.json()
            return result
        }

        return 'Please log in to add a course'
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Adds a question to the course with the given user id
export async function addCard(courseID: string, card: Card): Promise<void | string> {
    const user: User | undefined = getCookie('user') as User | undefined
    const token = getCookie('token')

    if (user) {
        const response = await fetch(`${BROWSER_API}/upload_card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                courseID,
                userID: user.id,
                card
            }),
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        return await response.json()
    }

    return 'Please log in to add a card'
}

// Adds a textinput to the course with the given user id
export async function sendText(courseID: string, text: string[]): Promise<void | string> {
    const user: User | undefined = getCookie('user') as User | undefined
    const token = getCookie('token')

    if (user) {
        const response = await fetch(`${BROWSER_API}/text`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userID: user.id,
                courseID,
                text
            }),
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        return await response.json()
    }

    return 'Please log in to add input'
}

export async function sendMark({courseID, mark}: MarkProps) {
    const user = getCookie('user') as User

    if (!user) {
        throw Error('You must be logged in to mark')
    }

    const response = await fetch(`${BROWSER_API}/mark`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            courseID, mark
        })
    })

    if (!response.ok) {
        const data = await response.json()

        throw Error(data.error)
    }

    return await response.json()
}
