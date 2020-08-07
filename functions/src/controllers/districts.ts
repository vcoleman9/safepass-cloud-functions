import { DistrictSchema } from './../models/district'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const districtsRouter = express.Router()

districtsRouter.post('/', async (request, response) => {
  const districtData: DistrictSchema = {
    name: request.body.name
  }

  if (!districtData.name) {
    return response.status(400).json({ error: "A district must have a name" })
  }

  // TODO: fuzzy search if the name is already taken
  const createdDistrict = await admin.db.collection('districts').add(pruneUndefined(districtData))

  return response.json({ districtPath: createdDistrict.path })
})

export default districtsRouter