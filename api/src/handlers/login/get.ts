// Used for type specification when recieving requests
import { FastifyRequest, FastifyReply } from 'fastify'

// Imports dotenv package to access environment variables
import dotenv from 'dotenv'
import db from '../../db'
import { invalidateCache } from '../../flow'

// Configures the environment variables
dotenv.config()

const { BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL } = process.env

if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !EXAM_URL) {
    throw new Error("Missing one of: BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL")
}

// OAuth2 Endpoints for Authentik
const AUTH_URL = `${BASE_URL}/application/o/authorize/`
const TOKEN_URL = `${BASE_URL}/application/o/token/`
const USERINFO_URL = `${BASE_URL}/application/o/userinfo/`

// Redirects to Authentik for login
export function loginHandler(_: FastifyRequest, res: FastifyReply) {
    const state = Math.random().toString(36).substring(5)
    const authQueryParams = new URLSearchParams({
        client_id: CLIENT_ID as string,
        redirect_uri: REDIRECT_URI as string,
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
    }).toString()

    res.redirect(`${AUTH_URL}?${authQueryParams}`)
}

/**
 * Callback route to exchange code for token
 * @param req Request
 * @param res Response
 */
export async function callbackHandler(req: FastifyRequest, res: FastifyReply): Promise<any> {
    const { code } = req.query as any

    if (!code) {
        return res.status(400).send('No authorization code found.')
    }

    try {
        // Exchanges callback code for access token
        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID as string,
                client_secret: CLIENT_SECRET as string,
                code: code as string,
                redirect_uri: REDIRECT_URI as string,
                grant_type: 'authorization_code',
            }).toString()
        })

        const tokenResponseBody = await tokenResponse.text()

        if (!tokenResponse.ok) {
            return res.status(500).send(`Failed to obtain token: ${tokenResponseBody}`)
        }

        const token = JSON.parse(tokenResponseBody)

        // Fetches user info using access token
        const userInfoResponse = await fetch(USERINFO_URL, {
            headers: { Authorization: `Bearer ${token.access_token}` }
        })

        if (!userInfoResponse.ok) {
            const userInfoError = await userInfoResponse.text()
            return res.status(500).send(`No user info found: ${userInfoError}`)
        }

        const userInfo = await userInfoResponse.json()

        const redirectUrl = new URL(`${EXAM_URL}/login`)
        const params = new URLSearchParams({
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            groups: userInfo.groups.join(','),
            access_token: token.access_token
        })

        const userRef = db.collection('User').doc(userInfo.email)
        let createdUser = false

        await db.runTransaction(async (transaction) => {
            const userSnap = await transaction.get(userRef)

            if (!userSnap.exists) {
                const userData = {
                    id: userInfo.sub,
                    name: userInfo.name,
                    email: userInfo.email,
                    courses: [],
                    score: 0,
                    solved: 0,
                    time: 0,
                };

                transaction.set(userRef, userData)
                createdUser = true
            }
        })

        // Invalidates the cache to ensure that the new user is included
        if (createdUser) {
            invalidateCache(userInfo.email);
        }

        redirectUrl.search = params.toString()
        return res.redirect(redirectUrl.toString())
    } catch (err: unknown) {
        const error = err as Error
        console.error('Error during OAuth2 flow:', error.message)
        return res.status(500).send('Authentication failed')
    }
}
