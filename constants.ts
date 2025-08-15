const { API_URL, NEXT_PUBLIC_BROWSER_API_URL } = process.env

export const API = API_URL || 'https://exam-api.login.no/api'
export const BROWSER_API = NEXT_PUBLIC_BROWSER_API_URL || 'https://exam-api.login.no/api'
// export const API = API_URL || 'http://localhost:8080/api'
// export const BROWSER_API = NEXT_PUBLIC_BROWSER_API_URL || 'http://localhost:8080/api'
