'use client'

import { getUser } from '@/utils/fetch'
import { useEffect } from 'react'

type Details = {
    id: string
    name: string
    username: string
}

// Sets user in localStorage based on URL params
export default function Login() {
    useEffect(() => {
        const url = window.location.href
        const query = new URLSearchParams(new URL(url).search)
        const id = query.get('id') as string
        const email = query.get('email') as string
        const name = query.get('name') as string
        const username = email?.split('@')[0]
        
        // Sets the user object in localStorage based on URL params
        localStorage.setItem('id', id)
        localStorage.setItem('name', query.get('name') as string)
        localStorage.setItem('email', email)
        localStorage.setItem('groups', query.get('groups') as string)
        localStorage.setItem('token', query.get('access_token') as string)

        // Fetches extra details from Firebase
        getDetails({ id, name, username })

        // Redirects back to where the user was
        const path = localStorage.getItem('redirect') || '/'
        localStorage.removeItem('redirect')
        window.location.href = path
    }, [])
}

// Fetches extra details from Firebase
async function getDetails({ username }: Details) {
    // Fetches the user from Firebase
    const user = await getUser(username)

    if (typeof user === 'string') {
        // Initializes data to zero since the user is new
        localStorage.setItem('time', '0')
        localStorage.setItem('score', '0')
        localStorage.setItem('solved', JSON.stringify([]))
    } else {
        // Sets data fetched from Firebase
        localStorage.setItem('time', user.time.toString())
        localStorage.setItem('score', user.score.toString())
        localStorage.setItem('solved', user.solved.toString())
    }
}
