import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const districtsRouter = express.Router()

districtsRouter.post('/', async (request, response) => {
  const data = pruneUndefined(request.body)

  if (!data.name) {
    return response.status(400).json({ error: "A district must have a name" })
  }

  // TODO: fuzzy search if the name is already taken
  const createdDistrict = await admin.db.collection('districts').add(data)

  return response.json({ districtPath: createdDistrict.path })
})

export default districtsRouter