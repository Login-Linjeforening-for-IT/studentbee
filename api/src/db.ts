import admin from 'firebase-admin'

const serviceAccount = require('../.secret.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
export default db