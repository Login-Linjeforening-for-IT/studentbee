import { NextRequest } from 'next/server'
import { authLogout } from 'uibee/utils'

export async function GET(request: NextRequest) {
    const data = await authLogout({
        req: request,
        path: '/login'
    })
    return data
}
