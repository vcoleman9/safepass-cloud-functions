import { UserSchema } from './../models/user'
import express from 'express'
import admin from './../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const usersRouter = express.Router()

const getDistrictFromSchoolPath = (schoolPath: string | undefined) => {
  return schoolPath ? admin.db.doc(schoolPath.split('/schools/')[ 0 ]) : undefined
}

/**
 * User creation endpoint to set role, school, and district at initialization. This is a convenience but is not
 * anymore efficient than creating and setting independently.
 */
usersRouter.post('/', async (request, response) => {
  const body = request.body
  const email: string | undefined = body.email
  const password: string | undefined = body.password

  const school = body.school ? admin.db.doc(body.school) : undefined
  const district = body.district ? admin.db.doc(body.district) : getDistrictFromSchoolPath(body.school)

  // Fields to extract from body are hardcoded to prevent the password from being copied, among other things
  const userContent: UserSchema = {
    role: body.role,
    district,
    school,
  }

  if (!email || !password) {
    return response.status(400).json({ error: 'Every user must have an email and a password' })
  }

  // TODO: verify that roles are necessary
  if (!userContent.role) {
    return response.status(400).json({ error: 'Every user must have a role' })
  }
  if (userContent.role !== 'admin' && userContent.role !== 'owner' && !userContent.district) {
    return response.status(400).json({ error: 'That type of user must have an assigned district' })
  }

  // TODO: Remove the document creation
  // Should be done automatically with a cloud function
  try {
    const user = await admin.auth.createUser({ email: email, password: password })
    const userDoc = admin.db.collection('users').doc(user.uid)
    await userDoc.set(pruneUndefined(userContent), { merge: true })
    const snap = await userDoc.get()
    return response.json({ id: snap.id, ...snap.data() })
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return response.status(400).json({ error: 'That email is already in use' })
    }
    return response.status(400).json({ ...error })
  }
})

// usersRouter.delete('/:id', async (request, response) => {
//   const id = request.params.id
//   await admin.auth.deleteUser(id)
//   await admin.db.doc(`users/${id}`).delete()
//   return response.status(204).end()
// })

export default usersRouter