import * as functions from 'firebase-functions'
import app from './app'
// import admin from './firestoreAuthentication'

// export const createUserDocument = functions.auth.user().onCreate(async (user) => {
//   await admin.db.collection('users').doc(user.uid).set({
//     email: user.email
//   }, { merge: true })
// })


export const api = functions.https.onRequest(app)
