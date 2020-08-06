import express from 'express'
import admin from './../firestoreAuthentication'

const usersRouter = express.Router()

function pruneUndefined<T>(input: any) {
  return Object.keys(input).reduce((accumulator: { [ k: string ]: T }, key) => {
    if (!!input[ key ]) {
      accumulator[ key ] = input[ key ]
    }
    return accumulator
  }, {})
}

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const email: string | undefined = body.email
  const password: string | undefined = body.password

  const userContent = pruneUndefined<string>({
    role: body.role,
    displayName: body.displayName,
    district: body.district && admin.db.doc(body.district),
    school: body.school && admin.db.doc(body.school)
  })

  if (!email || !password) {
    return response.status(400).send({ error: 'Every user must have an email and a password' })
  }

  // TODO: verify that roles are necessary
  if (!userContent.role) {
    return response.status(400).send({ error: 'Every user must have a role' })
  }
  if (userContent.role !== 'admin' && userContent.role !== 'owner' && !userContent.district) {
    return response.status(400).send({ error: 'That type of user must have an assigned district' })
  }

  try {
    const user = await admin.auth.createUser({ email: email, password: password })
    await admin.db.collection('users').doc(user.uid).set(userContent)
    return response.json({ userId: user.uid })
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return response.status(400).send({ error: 'That email is already in use' })
    }
    return response.status(400).send({ error: 'Something went wrong' })
  }
})

usersRouter.get('/idFromEmail/', async (request, response) => {
  const email = request.body.email
  try {
    const user = await admin.auth.getUserByEmail(email)
    return response.json({ id: user.uid })
  } catch (error) {
    return response.status(404).send({ error: 'The user could not be retrieved' })
  }
})

usersRouter.get('/emailFromId/', async (request, response) => {
  const id = request.body.id
  try {
    const user = await admin.auth.getUser(id)
    return response.json({ email: user.email })
  } catch (error) {
    return response.status(404).send({ error: 'The user could not be retrieved' })
  }
})

usersRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await admin.auth.deleteUser(id)
  await admin.db.doc(`users/${id}`).delete()
  return response.status(204).end()
})

export default usersRouter