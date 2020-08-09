import { DistrictSchema } from './../models/district'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const districtsRouter = express.Router()

districtsRouter.post('/', async (request, response) => {
  const districtData: DistrictSchema = { ...request.body }

  if (!districtData.name) {
    return response.status(400).json({ error: "A district must have a name" })
  }

  try {
    // TODO: fuzzy search if the name is already taken
    const createdDistrict = await admin.db.collection('districts').add(pruneUndefined(districtData))
    const snap = await createdDistrict.get()
    return response.json({ id: snap.id, ...snap.data() })
  } catch (error) {
    return response.status(400).json({ error: error.code })
  }
})

// districtsRouter.put('/:districtPath', async (request, response) => {
//   const districtPath = request.params.districtPath
//   const districtData: DistrictSchema = {
//     name: request.body.name
//   }

//   try {
//     await admin.db.doc(districtPath).set(pruneUndefined(districtData), { merge: true })
//     return response.status(200)
//   } catch (error) {
//     return response.status(400).json({ error: error.code })
//   }
// })

export default districtsRouter