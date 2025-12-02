'use server'

import { cookies } from 'next/headers'
import config from '../../constants'

const baseUrl = config.url.API

type ApiRequestProps = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
    options?: RequestInit
}

async function apiRequest({ method, path, data, options = {} }: ApiRequestProps) {
    const Cookies = await cookies()
    const token = Cookies.get('access_token')?.value || ''

    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    }

    const defaultOptions: RequestInit = {
        method,
        headers,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        headers['Content-Type'] = 'application/json'
        defaultOptions.body = JSON.stringify(data)
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetch(`${baseUrl}${path}`, finalOptions)

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`)
        }

        if (response.status === 204) {
            return {}
        }

        const data = await response.json()
        return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error)
        return { error: error.message || 'Unknown error' }
    }
}

// Wrapper functions for backward compatibility
async function getWrapper({ path, options = {} }: { path: string; options?: RequestInit }) {
    return await apiRequest({ method: 'GET', path, options })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function postWrapper({ path, data }: { path: string; data: any }) {
    return await apiRequest({ method: 'POST', path, data })
}

async function putWrapper({ path, data }: { path: string; data: unknown }) {
    return await apiRequest({ method: 'PUT', path, data })
}

async function deleteWrapper({ path, options }: { path: string; options?: RequestInit }) {
    return await apiRequest({ method: 'DELETE', path, options })
}

async function patchWrapper({ path, data = {}, options = {} }: { path: string; data?: unknown; options?: RequestInit }) {
    return await apiRequest({ method: 'PATCH', path, data, options })
}

export { apiRequest, getWrapper, postWrapper, putWrapper, deleteWrapper, patchWrapper }
