// Imports dotenv to access environment variables
import dotenv from 'dotenv'

// Imports crypto to hash access tokens
import crypto from 'crypto'

// Configures the environment variables
dotenv.config()

// Destructures the BACKEND_SECRET from the process environment (used to hash access tokens)
const { BACKEND_SECRET } = process.env

// Throws an error if the secret is not defined, since its important to ensure the security of the access tokens
if (!BACKEND_SECRET) {
    throw new Error('BACKEND_SECRET is not defined in the environment variables.')
}

/**
 * Defines the HandleTokenProps type, used for type specification when handling tokens
 */
type HandleTokenProps = {
    authorizationHeader: string | undefined
    username: string
    verifyToken: (token: string, username: string) => boolean
}

/**
 * Generates a token for the given user ID
 * @param id User ID
 * @returns Hashed token
 */
export function generateToken(id: string): string {
    // Gets the current time
    const timestamp = Date.now()

    // Combines the id, timestamp and backend secret to create a token
    const data = `${id}:${timestamp}:${BACKEND_SECRET}`

    // Hashes the data using sha256 and returns the hashed token
    const hash = crypto.createHash('sha256').update(data).digest('hex')

    // Combines the id, timestamp and hash to create a token data string
    const tokenData = `${id}:${timestamp}:${hash}`

    // Encodes the token data using base64
    const base64Token = Buffer.from(tokenData).toString('base64')
    
    // Returns the base64 encoded sha256 hashed token
    return base64Token
}

/**
 * Verifies that the passed token is valid for the given user
 * @param token Token to verify
 * @param username Username to verify the token against
 * @returns Boolean indicating if the token is valid
 */
export function verifyToken(token: string, username: string): boolean {
    // Decodes the token and splits it into id, timestamp and hash part
    const tokenData = Buffer.from(token, 'base64').toString('ascii')
    const tokenParts = tokenData.split(':')
    if (tokenParts.length !== 3) return false

    // Destructures the token parts
    const [id, timestamp, hash] = tokenParts

    // Ensure the id in the token matches the provided username
    if (id !== username) return false

    const data = `${id}:${timestamp}:${BACKEND_SECRET}`
    const expectedHash = crypto.createHash('sha256').update(data).digest('hex')

    return expectedHash === hash
}

/**
 * Checks the token and returns an error message if the token is invalid
 * @param authorizationHeader Authorization header including Bearer substring
 * @param username Username to verify the token against
 * @param verifyToken Function to verify the token 
 * @returns Boolean indicating if the token is valid, or an error message if the token is invalid
 */
export function checkToken({authorizationHeader, username, verifyToken}: HandleTokenProps): boolean | string  {
    // Checks if the authorization header is defined, and returns an error message if it is not
    if (!authorizationHeader) {
        return 'Authorization header missing'
    }

    // Splits the authorization header into Bearer and token parts, and takes the token itself
    const token = authorizationHeader.split(' ')[1]
    if (!token) {
        return 'Token missing from authorization header'
    }

    // Verifies the token and returns an error message if the token is invalid
    if (!verifyToken(token, username)) {
        return 'Invalid token'
    }

    // Returns true, meaning that the token is valid, since all checks have passed
    return true
}
