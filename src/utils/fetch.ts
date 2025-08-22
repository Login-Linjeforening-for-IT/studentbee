import { API, BROWSER_API } from '@parent/constants'
import getItem, { setItem } from './localStorage'

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
    
        const data = await response.json()
        return data
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


// Fetches the requested grades from the server.
// ID - Course ID
export async function getGrades(id: string): Promise<Object | string> {
    
    const courseID = `${id.toUpperCase()}-1`

    const queryBody = {
        'tabell_id':308,
        'api_versjon':1,
        'statuslinje':'J',
        'begrensning':'100',
        'kodetekst':'J',
        'desimal_separator':'.',
        'groupBy':['Institusjonskode', 'Årstall','Emnekode','Karakter'],
        'sortBy':['Årstall','Karakter'],
        'filter':[
            {
                'variabel': 'Emnekode',
                'selection': {
                   'filter': 'item',
                   'values': [
                      courseID
                   ]
                }
            },
            {
                'variabel': 'Institusjonskode',
                'selection': {
                    'filter': 'item',
                    'values': [
                        '1150'
                    ]
                }
            }
        ]
    }

    try {
        const response = await fetch('https://dbh-data.dataporten-api.no/Tabeller/hentJSONTabellData', {
            next: { revalidate: 10 },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryBody)
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        const grades = await response.json()
        return grades
    } catch (error) {
        const err = error as Error
        return err.message
    }
}

// Updates the passed course
export async function updateCourse({courseID, accepted, editing}: UpdateCourseProps) {
    const user: User | undefined = getItem('user') as User | undefined  
    const token = getItem('token')

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
                username: user.username,
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
    const token = getItem('token')
    let user = getItem('user') as User | undefined

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
                username: user.username,
                time: user.time += time 
            })
        })

        user.time += time
        setItem('user',JSON.stringify(user))
    
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

export async function getFile(courseID: string, name: string) {
    try {
        const response = await fetch(`${API}/file/${courseID}/${name}`, {
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

export async function getFiles(courseID: string) {
    try {
        const response = await fetch(`${API}/files/${courseID}`, {
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

export async function getUser(username: string): Promise<User | string> {
    try {
        const response = await fetch(`${BROWSER_API}/user/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error)
        }
    
        const user: User = await response.json()
        return user
    } catch (error: unknown) {
        const err = error as Error
        return err.message   
    }
}
