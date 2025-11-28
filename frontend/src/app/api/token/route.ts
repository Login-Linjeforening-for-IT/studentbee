import config from '@config'
import { NextRequest } from 'next/server'
import { authToken } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authToken({
        req: request,
        frontendURL: config.auth.BASE_URL,
        redirectPath: '/course'
    })
}
