import packageInfo from './package.json'

const { env } = process

const config = {
    url: {
        API: env.API_URL || 'https://studentbee-api.login.no/api',
        BROWSER_API: env.NEXT_PUBLIC_BROWSER_API_URL || 'https://studentbee-api.login.no/api',
        GITLAB_URL: 'https://gitlab.login.no',
    },
    authPath: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        token: '/api/auth/token',
        logout: '/api/auth/logout',
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
