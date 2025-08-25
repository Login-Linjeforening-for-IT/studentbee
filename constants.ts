import { version } from './package.json'

const { API_URL, NEXT_PUBLIC_BROWSER_API_URL } = process.env

export const API = API_URL || 'https://exam-api.login.no/api'
export const BROWSER_API = NEXT_PUBLIC_BROWSER_API_URL || 'https://exam-api.login.no/api'
// export const API = API_URL || 'http://localhost:8080/api'
// export const BROWSER_API = NEXT_PUBLIC_BROWSER_API_URL || 'http://localhost:8080/api'

const config = {
    url: {
        GITLAB_URL: 'https://gitlab.login.no',
    },
    version
}

export default config