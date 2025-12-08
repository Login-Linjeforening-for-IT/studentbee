import config from '@config'
import { getCookie } from 'uibee/utils'

type MarkProps = {
    courseId: string
    learningBased: boolean
}

type SendFileProps = {
    courseId: string
    name: string
    parent?: string
}

type UpdateFileProps = {
    courseId: string
    name: string
    content: string
}

// Adds a question to the course with the given user id
export async function addCard(courseId: string, card: Card): Promise<void | string> {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    if (username) {
        const response = await fetch(`${config.url.BROWSER_API}/upload_card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courseId, username, card }),
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
export async function sendText(courseId: string, text: string[]): Promise<void | string> {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    if (username) {
        const response = await fetch(`${config.url.BROWSER_API}/text`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, courseId, text }),
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        return await response.json()
    }

    return 'Please log in to add input'
}

export async function sendMark({ courseId, learningBased }: MarkProps) {
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
        body: JSON.stringify({ courseId, learningBased })
    })

    if (!response.ok) {
        const data = await response.json()
        throw Error(data.error)
    }

    return await response.json()
}

export async function sendFile({ courseId, name, parent }: SendFileProps) {
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
            courseId,
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

export async function updateFile({ courseId, name, content }: UpdateFileProps) {
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
            username,
            courseId,
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

export async function deleteFile({ courseId, name }: SendFileProps) {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')
    if (!username) {
        throw Error('You must be logged in to delete a file')
    }

    const response = await fetch(`${config.url.BROWSER_API}/file/${courseId}/${name}`, {
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


export async function postCourse({ id, name }: { id: string, name: string }) {
    const token = getCookie('access_token')

    if (!token) {
        return 'You need to log in.'
    }

    try {
        const response = await fetch(`${config.url.BROWSER_API}/course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code: id, name })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
        return JSON.stringify(error)
    }
}

export async function getFile(courseId: string, name: string) {
    const token = getCookie('access_token')

    try {
        const response = await fetch(`${config.url.API}/file/${courseId}/${name}`, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return await response.json()
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

export async function getFiles(courseId: string) {
    const token = getCookie('access_token')

    try {
        const response = await fetch(`${config.url.API}/files/${courseId}`, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return await response.json()
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}