import { API, BROWSER_API } from "@parent/constants"
import getCookie from "./cookies"

type UpdateCourseProps = {
    courseID: string
    accepted: Card[]
    editing: Editing
}

// Fetches the scoreboard from the server
export async function getScoreBoard() {
    try {
        const response = await fetch(`${API}/scoreboard`, {
            next: { revalidate: 10 },
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
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Fetches courses from server, different url based on location, therefore the 
// location parameter to ensure all requests are successful
export async function getCourses(location: 'server' | 'client'): Promise<CourseAsList[] | string> {
    const url = location === 'server' ? `${API}/courses` : `${BROWSER_API}/courses`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        const courses = await response.json()
        return courses
    } catch (error) {
        const err = error as Error
        return err.message
    }
}

// Fetches the requested course from the server if possible.
// ID - Course ID
// location - Whether the request is coming from SSR or CSR
export async function getCourse(id: string, location: 'server' | 'client'): Promise<Course | string> {
    const url = location === 'server' ? API : BROWSER_API

    try {
        const response = await fetch(`${url}/course/${id.toUpperCase()}`, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        const course = await response.json()
        return course
    } catch (error) {
        const err = error as Error
        return err.message
    }
}

// Updates the passed course
export async function updateCourse({courseID, accepted, editing}: UpdateCourseProps) {
    const user: User | undefined = getCookie('user') as User | undefined  
    const token = getCookie('token')

    try {
        if (!user) {
            throw Error('User not logged in')
        }

        const response = await fetch(`${BROWSER_API}/course/${courseID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userID: user.id,
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
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Updates the user's time spent on the page
export async function updateUserTime({time}: {time: number}) {
    const token = getCookie('token')
    const user = getCookie('user') as User | undefined

    try {
        if (!user) {
            throw Error('Please log in to log your efforts.')
        }

        const response = await fetch(`${BROWSER_API}/time`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userID: user.id,
                time
            })
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        const result = await response.json()
        return result
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }

}