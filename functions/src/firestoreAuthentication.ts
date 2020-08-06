import admin from 'firebase-admin'
const serviceAccount = require('../../../../../.firebasekeys/service-account-file.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safepass-76e29.firebaseio.com"
})

const auth = admin.auth()
const db = admin.firestore()

export default {
  auth,
  db
}
