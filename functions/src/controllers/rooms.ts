import { RoomSchema } from './../models/room'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const roomsRouter = express.Router()

// To follow REST principals, the school path must be in the url for uniquely identifying,
// and because it is not in the resource, it should not be in the body.
roomsRouter.post('/', async (request, response) => {
  try {
    const token = request.token
    if (!token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decoded = await admin.auth.verifyIdToken(token)
    const userSnap = await admin.db.doc(`users/${decoded.uid}`).get()
    const snapData = userSnap.data()
    if (!snapData || (snapData.role !== 'admin' && snapData.role !== 'district_admin')) {
      return response.status(401).json({ error: 'User is not authorized to do that' })
    }
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

// roomsRouter.put('/', async (request, response) => {
//   // Question: Do something when personCount > maxPersonCount or is that frontend only/cloud function alert
//   const roomData: RoomSchema = {
//     name: request.body.name,
//     category: request.body.category,
//     maxPersonCount: request.body.maxPersonCount,
//     personCount: request.body.personCount
//   }
// })

// TODO: Check if necessary. If so then during room creation check existing categories.
// roomsRouter.post('/categories', async (request, response) => {
//   const categoryName = request.body.categoryName
//   const school = request.body.school

//   if (!categoryName) {
//     return response.status(400).json({ error: 'You must name the room category for creation' })
//   } else if (!school) {
//     return response.status(400).json({ error: 'You must give the school for which you would like to define a new category of room' })
//   }

//   const rooms = admin.db.doc(`${school}/rooms/categories`)

//   try {
//     const newCategories = await admin.db.runTransaction(async transaction => {
//       const snap = await transaction.get(rooms)
//       const newCategories = [ ...snap.get('categories'), categoryName ]
//       transaction.update(rooms, 'categories', newCategories)
//       return newCategories
//     })
//     return response.json({ roomCategories: newCategories })
//   } catch (error) {
//     return response.status(400).send(error)
//   }
// })

export default roomsRouter