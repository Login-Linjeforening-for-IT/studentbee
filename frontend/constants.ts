import dotenv from 'dotenv'
import packageInfo from './package.json'

dotenv.config({ path: '../.env', quiet: true })

const { env } = process

const config = {
    url: {
        API: env.API_URL || 'https://api.exam.login.no/api',
        BROWSER_API: env.NEXT_PUBLIC_BROWSER_API_URL || 'https://api.exam.login.no/api',
        GITLAB_URL: 'https://gitlab.login.no',
    },
    auth: {
        BASE_URL: env.BASE_URL,
        LOGIN_URL: `${env.BASE_URL}/api/login`,
        REDIRECT_URL: `${env.BASE_URL}/api/callback`,
        TOKEN_URL: `${env.BASE_URL}/api/token`,
        LOGOUT_URL: `${env.BASE_URL}/api/logout`,
    },
    authentik: {
        CLIENT_ID: env.CLIENT_ID,
        CLIENT_SECRET: env.CLIENT_SECRET,
        AUTH_URL: `${env.AUTHENTIK_URL}/application/o/authorize/`,
        TOKEN_URL: `${env.AUTHENTIK_URL}/application/o/token/`,
        USERINFO_URL: `${env.AUTHENTIK_URL}/application/o/userinfo/`,
    },
    version: packageInfo.version
}

export default config
