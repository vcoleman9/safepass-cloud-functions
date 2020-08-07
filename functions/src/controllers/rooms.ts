import { RoomSchema } from './../models/room'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const roomsRouter = express.Router()

roomsRouter.post('/', async (request, response) => {
  // TODO: Use token to extract district from user if its not supplied in the body
  const school = request.body.school


  // Question: Do something when personCount > maxPersonCount or is that frontend only/cloud function alert
  const roomData: RoomSchema = {
    name: request.body.name,
    category: request.body.category,
    maxPersonCount: request.body.maxPersonCount,
    personCount: request.body.personCount
  }

  if (!roomData.name) {
    return response.status(400).json({ error: 'A room must have a name' })
  } else if (!school) {
    return response.status(400).json({ error: 'A room can only exist in a school' })
  }

  const createdRoom = await admin.db.doc(school).collection('rooms').add(pruneUndefined(roomData))
  return response.json({ roomPath: createdRoom.path })
})


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