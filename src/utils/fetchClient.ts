'use client'

import { API } from "@parent/constants"
import getCookie from "./cookies"

// Adds a course with the given user id, course name and questions
export async function addCourse(course: Course): Promise<void | string> {
    const userCookie = getCookie('user')
    const token = getCookie('token')
    const userFromCookie: LoggedInUser = userCookie ? JSON.parse(userCookie) : undefined

    try {
        if (userFromCookie) {
            const response = await fetch(`${API}/upload_course`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: userFromCookie.id,
                    course
                }),
            })
        
            if (!response.ok) {
                const data = await response.json()
        
                throw Error(data.error)
            }
    
            const resp = response.json()
            return resp
        }

        return 'Please log in to add a course'
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Adds a question to the course with the given user id
export async function addCard(course_id: string, card: Card): Promise<void | string> {
    const userCookie = getCookie('user')
    const token = getCookie('token')
    const userFromCookie: LoggedInUser = userCookie ? JSON.parse(userCookie) : undefined

    if (userFromCookie) {
        const response = await fetch(`${API}/upload_card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                course_id,
                user_id: userFromCookie.id,
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
export async function addText(course_id: string, text: string): Promise<void | string> {
    const userCookie = getCookie('user')
    const token = getCookie('token')
    const userFromCookie: LoggedInUser = userCookie ? JSON.parse(userCookie) : undefined

    if (userFromCookie) {
        const response = await fetch(`${API}/upload_text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                course_id,
                user_id: userFromCookie.id,
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
