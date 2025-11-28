import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const requiredEnvironmentVariables = [
    'AUTHENTIK_URL',
    'DB_PASSWORD',
]

const missingVariables = requiredEnvironmentVariables
    .filter((key) => !process.env[key])
    .map((key) => `${key}: ${process.env[key] || 'undefined'}`)
    .join('\n    ')

if (missingVariables.length > 0) {
    throw new Error(`Missing essential environment variables:\n    ${missingVariables}`)
}

const env = Object.fromEntries(
    requiredEnvironmentVariables.map((key) => [key, process.env[key]])
)

const config = {
    DBH_API: 'https://dbh-data.dataporten-api.no/Tabeller/hentJSONTabellData',
    USERINFO_URL: `${env.AUTHENTIK_URL}/application/o/userinfo/`,
    DB: env.DB,
    DB_USER: env.DB_USER,
    DB_HOST: env.DB_HOST,
    DB_PASSWORD: env.DB_PASSWORD,
    DB_PORT: Number(env.DB_PORT) || 5432,
    DB_MAX_CONN: 20,
    DB_IDLE_TIMEOUT_MS: 5000,
    DB_TIMEOUT_MS: 3000,
    CACHE_TTL: 1000
}

export default config
