import config from '@config'
import { NextRequest } from 'next/server'
import { authLogin } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authLogin({
        req: request,
        authURL: config.authentik.AUTH_URL,
        clientID: config.authentik.CLIENT_ID,
        redirectPath: config.authPath.callback,
    })
}
