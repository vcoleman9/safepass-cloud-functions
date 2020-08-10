import * as functions from 'firebase-functions'
import app from './app'
import admin from './firestoreAuthentication'

export const initUserDocument = functions.auth.user().onCreate(async (user) => {
  const userDataToCopy = user.displayName ? {
    email: user.email,
    displayName: user.displayName
  } : {
      email: user.email
    }
  await admin.db.collection('users').doc(user.uid).set(userDataToCopy, { merge: true })
})

export const api = functions.https.onRequest(app)
