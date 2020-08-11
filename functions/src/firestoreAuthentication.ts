import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

admin.initializeApp()

const auth = admin.auth()
const db = admin.firestore()

export default {
  auth,
  db
}
