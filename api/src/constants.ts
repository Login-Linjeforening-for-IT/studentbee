import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

const requiredEnvironmentVariables = [
    'BASE_URL',
]

const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
)

if ( missingVariables.length > 0) {
    throw new Error(
        'Missing essential environment variables:\n' +
            missingVariables
                .map((key) => `${key}: ${process.env[key] || 'undefined'}`)
                .join('\n')
    )
}

const env = Object.fromEntries(
    requiredEnvironmentVariables.map((key) => [key, process.env[key]])
)

const USERINFO_URL = `${env.BASE_URL}/application/o/userinfo/`

const config = {
    DBH_API: 'https://dbh-data.dataporten-api.no/Tabeller/hentJSONTabellData',
    USERINFO_URL
}

export default config
