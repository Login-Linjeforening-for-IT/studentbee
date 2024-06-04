// Imports necesarry dependencies
// Initializes the Firebase Admin SDK
import admin, { ServiceAccount } from 'firebase-admin'

// Imports dotenv package to access environment variables
import dotenv from 'dotenv'

// Configures the environment variables
dotenv.config()

// Destructures the environment variables from the environment
const { 
    PRODUCTION, 
    TYPE, 
    AUTH_URI, 
    TOKEN_URI, 
    AUTH_CERT_URL, 
    UNIVERSE_DOMAIN,

    DEV_PROJECT_ID,
    DEV_PRIVATE_KEY_ID,
    DEV_PRIVATE_KEY,
    DEV_CLIENT_EMAIL,
    DEV_CLIENT_ID,
    DEV_CLIENT_CERT_URL,

    PROD_PROJECT_ID,
    PROD_PRIVATE_KEY_ID,
    PROD_PRIVATE_KEY,
    PROD_CLIENT_EMAIL,
    PROD_CLIENT_ID,
    PROD_CLIENT_CERT_URL
} = process.env

// Destructures the environment variables for the production service account
const PROD = {
    PROJECT_ID: PROD_PROJECT_ID,
    PRIVATE_KEY_ID: PROD_PRIVATE_KEY_ID,
    PRIVATE_KEY: PROD_PRIVATE_KEY,
    CLIENT_EMAIL: PROD_CLIENT_EMAIL,
    CLIENT_ID: PROD_CLIENT_ID,
    CLIENT_CERT_URL: PROD_CLIENT_CERT_URL
}

// Destructures the environment variables for the development service account
const DEV = {
    PROJECT_ID: DEV_PROJECT_ID,
    PRIVATE_KEY_ID: DEV_PRIVATE_KEY_ID,
    PRIVATE_KEY: DEV_PRIVATE_KEY,
    CLIENT_EMAIL: DEV_CLIENT_EMAIL,
    CLIENT_ID: DEV_CLIENT_ID,
    CLIENT_CERT_URL: DEV_CLIENT_CERT_URL
}

// Determines which service account to use based on the production environment
const SERVICE_ACCOUNT = PRODUCTION ? PROD : DEV

// Initializes the Firebase Admin SDK with the service account
admin.initializeApp({
    credential: admin.credential.cert({
        type: TYPE,
        project_id: SERVICE_ACCOUNT.PROJECT_ID,
        private_key_id: SERVICE_ACCOUNT.PRIVATE_KEY_ID,
        private_key: SERVICE_ACCOUNT.PRIVATE_KEY,
        client_email: SERVICE_ACCOUNT.CLIENT_EMAIL,
        client_id: SERVICE_ACCOUNT.CLIENT_ID,
        auth_uri: AUTH_URI,
        token_uri: TOKEN_URI,
        auth_provider_x509_cert_url: AUTH_CERT_URL,
        client_x509_cert_url: SERVICE_ACCOUNT.CLIENT_CERT_URL,
        universe_domain: UNIVERSE_DOMAIN
    } as ServiceAccount),
})

// Exports the Firestore database
const db = admin.firestore()
export default db