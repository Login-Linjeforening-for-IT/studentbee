import dotenv from 'dotenv'

dotenv.config()

const { API_URL, BROWSER_API_URL } = process.env

export const API = API_URL ? API_URL : 'https://dev-exam-api.login.no/api'
export const BROWSER_API = BROWSER_API_URL ? BROWSER_API_URL : 'https://dev-exam-api.login.no/api'