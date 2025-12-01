import config from '@config'
import { getCookie } from 'uibee/utils'

type UpdateCourseProps = {
    courseID: string
    accepted: Card[]
    editing: Editing
}

// Updates the passed course
export async function updateCourse({courseID, accepted, editing}: UpdateCourseProps) {
    const username = getCookie('user_nickname')
    const token = getCookie('access_token')

    try {
        if (!username) {
            throw Error('User not logged in')
        }

        const response = await fetch(`${config.url.BROWSER_API}/course/${courseID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                accepted,
                editing
            })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const result = await response.json()
        return result
    } catch(error: unknown) {
        const err = error as Error
        return err.message
    }
}

export async function getFile(courseID: string, name: string) {
    const token = getCookie('access_token')

    try {
        const response = await fetch(`${config.url.API}/file/${courseID}/${name}`, {
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
    } catch(error: unknown) {
        const err = error as Error
        return err.message
    }
}

export async function getFiles(courseID: string) {
    const token = getCookie('access_token')

    try {
        const response = await fetch(`${config.url.API}/files/${courseID}`, {
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
    } catch(error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Fetches the requested grades from the server.
// ID - Course ID
export async function getGrades(course: string): Promise<Grades | string> {
    const token = getCookie('access_token')

    try {
        const response = await fetch(`${config.url.BROWSER_API}/grades/${course}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const grades: Grades = await response.json()
        return grades
    } catch(error: unknown) {
        const err = error as Error
        return err.message
    }
}
