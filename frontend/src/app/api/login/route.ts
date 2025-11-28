import config from '@config'
import { authLogin } from 'uibee/utils'

export async function GET() {
    return await authLogin({
        authURL: config.authentik.AUTH_URL,
        clientID: config.authentik.CLIENT_ID,
        redirectURL: config.auth.REDIRECT_URL,
    })
}