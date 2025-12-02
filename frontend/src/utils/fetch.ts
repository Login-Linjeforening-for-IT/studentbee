import config from '@config'
import { getCookie } from 'uibee/utils'

type UpdateCourseProps = {
    id: string
    editing: Editing
}

export async function getCourse(id: string) {
    const token = getCookie('access_token')

    if (!token) {
        return 'You need to log in.'
    }

    try {
        const response = await fetch(`${config.url.BROWSER_API}/course/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
            body: JSON.stringify({ courseCode: id, name })
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

// Updates the passed course
export async function updateCourse({ id, editing }: UpdateCourseProps) {
    const token = getCookie('access_token')

    try {
        if (!token) {
            throw Error('User not logged in')
        }

        const response = await fetch(`${config.url.BROWSER_API}/course/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...editing })
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const result = await response.json()
        return result
    } catch (error: unknown) {
        const err = error as Error
        return err.message
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
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}
