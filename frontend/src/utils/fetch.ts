import config from '@config'
import { getCookie } from 'uibee/utils'

type UpdateCourseProps = {
    courseID: string
    accepted: Card[]
    editing: Editing
}

// Fetches courses from server, different url based on location, therefore the
// location parameter to ensure all requests are successful
export async function getCourses(location: 'server' | 'client'): Promise<CourseAsList[] | string> {
    const url = location === 'server' ? `${config.url.API}/courses` : `${config.url.BROWSER_API}/courses`
    const token = getCookie('access_token')

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        const courses = await response.json()
        return courses
    } catch(error) {
        const err = error as Error
        return err.message
    }
}

// Fetches the requested course from the server if possible.
// ID - Course ID
// location - Whether the request is coming from SSR or CSR
export async function getCourse(id: string, location: 'server' | 'client'): Promise<Course | string> {
    const url = location === 'server' ? config.url.API : config.url.BROWSER_API
    const token = getCookie('access_token')

    try {
        const response = await fetch(`${url}/course/${id.toUpperCase()}`, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        const course = await response.json()
        return course
    } catch(error) {
        const err = error as Error
        return err.message
    }
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
            const data = await response.json()

            throw Error(data.error)
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
            const data = await response.json()

            throw Error(data.error)
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
            const data = await response.json()

            throw Error(data.error)
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
            const data = await response.json()
            throw new Error(data.error)
        }

        const grades: Grades = await response.json()
        return grades
    } catch(error: unknown) {
        const err = error as Error
        return err.message
    }
}
