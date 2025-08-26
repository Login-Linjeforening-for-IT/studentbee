import packageInfo from './package.json'

const { API_URL, NEXT_PUBLIC_BROWSER_API_URL } = process.env

const config = {
    url: {
        API: API_URL || 'https://exam-api.login.no/api',
        BROWSER_API: NEXT_PUBLIC_BROWSER_API_URL || 'https://exam-api.login.no/api',
        GITLAB_URL: 'https://gitlab.login.no',
    },
    version: packageInfo.version
}
export default config