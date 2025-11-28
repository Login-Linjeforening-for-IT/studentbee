import config from '@config'
import { NextRequest } from 'next/server'
import { authCallback } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authCallback({
        req: request,
        tokenURL: config.authentik.TOKEN_URL,
        clientID: config.authentik.CLIENT_ID,
        clientSecret: config.authentik.CLIENT_SECRET,
        redirectURL: config.auth.REDIRECT_URL,
        userInfoURL: config.authentik.USERINFO_URL,
        tokenRedirectURL: config.auth.TOKEN_URL
    })
}