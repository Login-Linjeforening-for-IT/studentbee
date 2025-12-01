'use server'

import config from '@config'
import { getCookie } from 'uibee/utils'

type MarkProps = {
    courseID: string
    learningBased: boolean
}

type SendFileProps = {
    courseID: string
    name: string
    parent?: string
}

type UpdateFileProps = {
    courseID: string
    name: string
    content: string
}

// Adds a course with the given user id, course name and questions
export async function addCourse(course: Course): Promise<void | string> {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    try {
        if (username) {
            const response = await fetch(`${config.url.BROWSER_API}/upload_course`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username,
                    course: { ...course, id: course.id.trim() }
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
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    if (username) {
        const response = await fetch(`${config.url.BROWSER_API}/upload_card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                courseID,
                username: username,
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
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    if (username) {
        const response = await fetch(`${config.url.BROWSER_API}/text`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
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

export async function sendMark({ courseID, learningBased }: MarkProps) {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    if (!username) {
        throw Error('You must be logged in to mark a course as learning based')
    }

    const response = await fetch(`${config.url.BROWSER_API}/learningBased`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseID, learningBased })
    })

    if (!response.ok) {
        const data = await response.json()
        throw Error(data.error)
    }

    return await response.json()
}

export async function sendFile({ courseID, name, parent }: SendFileProps) {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')
    if (!username) {
        throw Error('You must be logged in to upload a file')
    }

    const response = await fetch(`${config.url.BROWSER_API}/file`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username,
            courseID,
            name,
            parent
        })
    })

    if (!response.ok) {
        const data = await response.json()
        throw Error(data.error)
    }

    return await response.json()
}

export async function updateFile({ courseID, name, content }: UpdateFileProps) {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')
    if (!username) {
        throw Error('You must be logged in to upload a file')
    }

    const response = await fetch(`${config.url.BROWSER_API}/file`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username,
            courseID,
            name,
            content
        })
    })

    if (!response.ok) {
        const data = await response.json()
        throw Error(data.error)
    }

    return await response.json()
}

export async function deleteFile({ courseID, name }: SendFileProps) {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')
    if (!username) {
        throw Error('You must be logged in to delete a file')
    }

    const response = await fetch(`${config.url.BROWSER_API}/file/${courseID}/${name}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username
        })
    })

    if (!response.ok) {
        const data = await response.json()
        throw Error(data.error)
    }

    return await response.json()
}
