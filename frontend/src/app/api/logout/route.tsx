import config from '@config'
import { authLogout } from 'uibee/utils'

export async function GET() {
    const data = await authLogout({ frontendURL: config.auth.BASE_URL })
    return data
}
