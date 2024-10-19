import dotenv from 'dotenv'

dotenv.config()

const { API_URL, BROWSER_API_URL } = process.env

// Checks that all necessary environment variables are defined
// if ((!API_URL || !BROWSER_API_URL)) {
//     throw new Error('Missing API_URL or / and BROWSER_API_URL (frontend).')
// }

// export const TEST_API = 'http://localhost:8080/api'
export const API = API_URL || 'https://exam-api.login.no/api'
export const BROWSER_API = BROWSER_API_URL || 'https://exam-api.login.no/api'

// For local testing
// export const API = TEST_API
// export const BROWSER_API = API