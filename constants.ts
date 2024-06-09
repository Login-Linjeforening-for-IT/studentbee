import dotenv from 'dotenv'

dotenv.config()

const { API_URL, BROWSER_API_URL } = process.env

// export const TEST_API = 'http://localhost:8080/api'
export const API = API_URL || 'http://localhost:8080/api'
export const BROWSER_API = BROWSER_API_URL || 'https://dev-exam-api.login.no/api'

// For local testing
// export const API = TEST_API
// export const BROWSER_API = API