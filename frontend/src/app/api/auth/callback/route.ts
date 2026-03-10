import config from '@config'
import { NextRequest } from 'next/server'
import { authCallback } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authCallback({
        req: request,
        tokenURL: config.authentik.TOKEN_URL,
        clientID: config.authentik.CLIENT_ID,
        clientSecret: config.authentik.CLIENT_SECRET,
        redirectPath: config.authPath.callback,
        userInfoURL: config.authentik.USERINFO_URL,
        tokenRedirectPath: config.authPath.token
    })
}
