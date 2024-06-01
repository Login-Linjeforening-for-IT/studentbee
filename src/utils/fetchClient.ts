'use client'

import { BROWSER_API } from "@parent/constants"
import getItem from "./localStorage"

type MarkProps = {
    courseID: string
    mark: boolean
}

type SendFileProps = {
    courseID: string
    name: string
}

// Adds a course with the given user id, course name and questions
export async function addCourse(course: Course): Promise<void | string> {
    const user: User | undefined = getItem('user') as User | undefined
    const token = getItem('token')

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
    const user: User | undefined = getItem('user') as User | undefined
    const token = getItem('token')

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
    const user: User | undefined = getItem('user') as User | undefined
    const token = getItem('token')

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
    const user = getItem('user') as User

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

export async function sendFile({courseID, name}: SendFileProps) {
    const user = getItem('user') as User

    if (!user) {
        throw Error('You must be logged in to upload a file')
    }

    const response = await fetch(`${BROWSER_API}/file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userID: user.id,
            courseID,
            name
        })
    })

    if (!response.ok) {
        const data = await response.json()

        throw Error(data.error)
    }

    return await response.json()
}