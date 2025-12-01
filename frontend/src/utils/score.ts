import config from '@config'
import { getCookie, setCookie } from 'uibee/utils'

export default async function addScore(){
    const token = getCookie('access_token')
    const username = getCookie('user')

    try {
        if (!username) {
            throw Error('Please log in to log your efforts.')
        }

        setCookie('user', JSON.stringify(username))

        const response = await fetch(`${config.url.BROWSER_API}/score/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
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
