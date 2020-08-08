import * as functions from 'firebase-functions'
import app from './app'

// import admin from './firestoreAuthentication'
// exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
//   await admin.db.collection('users').doc(user.uid).set({}, { merge: true })
// })

exports.api = functions.https.onRequest(app)
