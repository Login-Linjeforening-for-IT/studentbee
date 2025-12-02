import config from '@config'
import { NextRequest } from 'next/server'
import { authToken } from 'uibee/utils'

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const token = url.searchParams.get('access_token')
    const id = url.searchParams.get('id')

    await fetch(`${config.url.API}/user/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    const data = await authToken({
        req: request,
        frontendURL: config.auth.BASE_URL,
    })

    return data
}
