import { DistrictSchema } from './../models/district'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined, tokenMatchesOneOfRoles } from '../utils/functions'

const districtsRouter = express.Router()

districtsRouter.post('/', async (request, response) => {
  try {
    await tokenMatchesOneOfRoles(request.token, 'admin')
  } catch (error) {
    return response.status(401).json({ ...error })
  }

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
    return response.status(400).json({ ...error })
  }
})

districtsRouter.put('/:districtId', async (request, response) => {
  try {
    await tokenMatchesOneOfRoles(request.token, 'admin', 'district_admin')
  } catch (error) {
    return response.status(401).json({ ...error })
  }

  const districtData: DistrictSchema = { ...request.body }

  if (!request.districtPath) {
    return response.status(400).json({ error: "Middleware/routing failure: districtId not matched" })
  }

  try {
    await admin.db.doc(request.districtPath).set(pruneUndefined(districtData), { merge: true })
    return response.status(200)
  } catch (error) {
    return response.status(400).json({ error: error.code })
  }
})

export default districtsRouter