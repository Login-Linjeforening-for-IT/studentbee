import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const { BACKEND_SECRET } = process.env

if (!BACKEND_SECRET) {
    throw new Error('BACKEND_SECRET is not defined in the environment variables.')
}

type HandleTokenProps = {
    authorizationHeader: string | undefined
    userID: number
    verifyToken: (token: string, userID: string) => boolean
}

// Generates a token for the given user ID
export function generateToken(id: string): string {
    const timestamp = Date.now()
    const data = `${id}:${timestamp}:${BACKEND_SECRET}`
    const hash = crypto.createHash('sha256').update(data).digest('hex')
    const tokenData = `${id}:${timestamp}:${hash}`
    const base64Token = Buffer.from(tokenData).toString('base64')
    return base64Token
}

// Verifies that the passed token is valid for the given user
export function verifyToken(token: string, userID: string): boolean {
    const tokenData = Buffer.from(token, 'base64').toString('ascii')
    const tokenParts = tokenData.split(':')
    if (tokenParts.length !== 3) return false

    const [id, timestamp, hash] = tokenParts

    // Ensure the id in the token matches the provided userID
    if (id !== userID) return false

    const data = `${id}:${timestamp}:${BACKEND_SECRET}`
    const expectedHash = crypto.createHash('sha256').update(data).digest('hex')

    return expectedHash === hash
}

// Checks the token and returns an error message if the token is invalid
export function checkToken({authorizationHeader, userID, verifyToken}: HandleTokenProps): boolean | string  {
    if (!authorizationHeader) {
        return 'Authorization header missing'
    }

    const token = authorizationHeader.split(' ')[1]
    if (!token) {
        return 'Token missing from authorization header'
    }

    if (!verifyToken(token, userID.toString())) {
        return 'Invalid token'
    }

    return true
}