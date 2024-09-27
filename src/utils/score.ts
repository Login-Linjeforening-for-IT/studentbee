import { BROWSER_API } from "@parent/constants";
import getItem, { setItem } from "./localStorage"
import { stringify } from "querystring";

export async function addScore(){
    
    const token = getItem('token') 
    let user = getItem('user') as User | undefined

    try {
        if (!user) {
            throw Error('Please log in to log your efforts.')
        }

        user.score += 10
        setItem('user', JSON.stringify(user)) 

        const response = await fetch(`${BROWSER_API}/score`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: user.username,
                score: user.score 
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