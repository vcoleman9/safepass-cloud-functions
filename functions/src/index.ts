import * as functions from 'firebase-functions'
import app from './app'
export default functions.https.onRequest(app)