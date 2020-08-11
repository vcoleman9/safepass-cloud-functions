import { RoomSchema } from './../models/room'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined, tokenMatchesOneOfRoles } from '../utils/functions'

const roomsRouter = express.Router()

// To follow REST principals, the school path must be in the url for uniquely identifying,
// and because it is not in the resource, it should not be in the body.
roomsRouter.post('/', async (request, response) => {
  try {
    await tokenMatchesOneOfRoles(request.token, 'admin', 'district_admin')
  } catch (error) {
    return response.status(401).json({ ...error })
  }

  const schoolPath = request.schoolPath

  if (!schoolPath) {
    return response.status(404).json({ error: 'School path must be specified' })
  }

  // Question: Do something when personCount > maxPersonCount or is that frontend only/cloud function alert?
  const roomData: RoomSchema = { ...request.body }

  if (!roomData.name) {
    return response.status(400).json({ error: 'A room must have a name' })
  }

  try {
    const createdRoom = await admin.db.collection(`${schoolPath}/rooms`).add(pruneUndefined(roomData))
    const snap = await createdRoom.get()
    return response.json({ id: snap.id, ...snap.data() })
  } catch (error) {
    return response.status(400).json({ ...error })
  }
})

roomsRouter.put('/:roomId', async (request, response) => {
  try {
    await tokenMatchesOneOfRoles(request.token, 'admin', 'district_admin')
  } catch (error) {
    return response.status(401).json({ ...error })
  }

  const schoolPath = request.schoolPath

  if (!schoolPath) {
    return response.status(404).json({ error: 'School path must be specified' })
  }

  const roomPath = `${schoolPath}/rooms/${request.params.roomId}`
  const roomData: RoomSchema = { ...request.body }

  try {
    await admin.db.doc(roomPath).set(pruneUndefined(roomData), { merge: true })
    return response.status(200)
  } catch (error) {
    return response.status(400).json({ ...error })
  }
})

export default roomsRouter