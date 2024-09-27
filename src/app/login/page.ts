'use client'

import { useEffect } from "react"

export default function Login() {
    useEffect(() => {
        const url = window.location.href
        const query = new URLSearchParams(new URL(url).search)
        
        localStorage.setItem('id', query.get('id') as string)
        localStorage.setItem('name', query.get('name') as string)
        localStorage.setItem('email', query.get('email') as string)
        localStorage.setItem('groups', query.get('groups') as string)
        localStorage.setItem('token', query.get('access_token') as string)

        // Redirects back to where the user was
        const path = localStorage.getItem('redirect') || '/'
        localStorage.removeItem('redirect')
        window.location.href = path
    }, [])
}
