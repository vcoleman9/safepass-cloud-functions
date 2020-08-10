import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

// TODO: Require tokens in other requests. Either through IAM or rules, need to verify access is allowed
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://safepass-76e29.firebaseio.com"
})

const auth = admin.auth()
const db = admin.firestore()

export default {
  auth,
  db
}
