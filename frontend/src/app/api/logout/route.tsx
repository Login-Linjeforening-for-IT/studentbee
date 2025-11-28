import config from '@config'
import { authLogout } from 'uibee/utils'

export async function GET() {
    return await authLogout({
        frontendURL: config.auth.BASE_URL
    })
}
