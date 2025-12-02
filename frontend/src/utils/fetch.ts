import config from '@config'

export async function getCourse(location: 'server' | 'client', id: string, token: string): Promise<Course | string> {
    if (!token) {
        return 'You need to log in.'
    }

    try {
        const url = location === 'server' ? config.url.API : config.url.BROWSER_API
        const response = await fetch(`${url}/course/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
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
