import admin from 'firebase-admin'

const serviceAccount = require('../secrets/.dev.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
export default db