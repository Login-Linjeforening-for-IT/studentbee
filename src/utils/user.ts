'use client'

import { BROWSER_API } from "@parent/constants"
import getCookie, { removeCookie, setCookie } from "./cookies"

// Function to login the user
export async function sendLogin(user: LoginUser): Promise<true | string> {
    try {
        const response = await fetch(`${BROWSER_API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error)
        }

        const result: LoginResponse = await response.json()
        const userResult: User = {
            id: result.id,
            name: result.name,
            username: result.username,
            time: result.time,
        }

        setCookie('token', result.token)
        setCookie('user', JSON.stringify(userResult))
        window.location.reload()
        return true
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Function to logout the user
export async function sendLogout(): Promise<Boolean | string> {
    try {
        const token = getCookie('token')
        const user = getCookie('user')

        if (!token || !user) {
            // Removes cookies and user from localstorage if the user wants to log out
            removeCookie('token')
            removeCookie('user')
            window.location.href = '/login'
            return "Logged out successfully."
            
        }

        // Removes cookies and user from localstorage if the user wants to log out
        removeCookie('token')
        removeCookie('user')
        window.location.reload()

        // const response = await fetch(`${API}/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': token
        //     },
        //     body: JSON.stringify(user)
        // })

        // if (!response.ok) {
        //     const data = await response.json()

        //     throw Error(data.error)
        // }

        return true
    } catch (error) {
        return `Failed to log out: ${error}`
    }
}

// Function to delete the user
export async function sendDelete(): Promise<Boolean | string> {
    try {
        const user = getCookie('user')

        if (!user) {
            // Removes cookies and user from localstorage if the user wants to delete their account
            removeCookie('user')
            getRedirect('/')
            return "Deleted account."
        }

        // Removes cookies and user from localstorage if the user wants to delete their account
        removeCookie('user')

        const response = await fetch(`${BROWSER_API}/account/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        getRedirect('/')
        return true
    } catch (error) {
        return `Failed to delete account: ${error}`
    }
}

// Function to register the user
export async function sendRegister(user: RegisterUser): Promise<true | string> {

    try {
        const response = await fetch(`${BROWSER_API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })


        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        // Redirects to login page on successful registration
        setCookie('redirect', '/login')
        getRedirect()

        return true
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Sends the time spent on the page to the server
export async function sendTimeSpent(): Promise<true | string> {
    const user: User | undefined = getCookie('user') as User | undefined
    const token = getCookie('token')

    if (!user) {
        return 'Please log in to log your efforts.'
    }

    try {
        const response = await fetch(`${BROWSER_API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userID: user.id,
                time: user.time
            })
        })

        if (!response.ok) {
            const data = await response.json()
            throw Error(data.error)
        }

        return true
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Checks if the user has a user object and is therefore likely to be logged in
// Note that this only checks what icons to display, and it will still be
// properly checked if the user clicks this icon or navigates to a page that
// requires login
export default function isLoggedIn() {
    if (typeof localStorage === 'undefined') {
        return false
    }

    const user: User | undefined = getCookie('user') as User | undefined

    if (!user) {
        return false
    }

    return user.username
}

// Redirects the user to the page they were trying to access after successful login or register
export function getRedirect(alternative?: string): void {
    const redirect = localStorage.getItem('redirect')

    if (redirect) {
        window.location.href = redirect
        localStorage.removeItem('redirect')
    }

    if (alternative) {
        window.location.href = alternative
    }
}