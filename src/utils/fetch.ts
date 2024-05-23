import { API } from "@parent/constants"

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

export async function getCourses(): Promise<CourseAsList[] | string> {
    try {
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
    
        const courses = await response.json()
        return courses
    } catch (error) {
        const err = error as Error
        return err.message
    }
}

export async function getCourse(id: string): Promise<Course | string> {
    try {
        const response = await fetch(`${API}/course/${id}`, {
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
    } catch (error) {
        const err = error as Error
        return err.message
    }
}