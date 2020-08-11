import { SchoolSchema } from './../models/school'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined, tokenMatchesOneOfRoles } from '../utils/functions'

const schoolsRouter = express.Router()

schoolsRouter.post('/', async (request, response) => {
  try {
    await tokenMatchesOneOfRoles(request.token, 'admin', 'district_admin', 'owner')
  } catch (error) {
    return response.status(401).json({ ...error })
  }

  const districtPath = request.districtPath

  if (!districtPath) {
    return response.status(404).json({ error: 'District path must be specified' })
  }

  const schoolData: SchoolSchema = { ...request.body }

  if (!schoolData.name) {
    return response.status(400).json({ error: 'A school must have a name' })
  }

  try {
    const createdSchool = await admin.db.collection(`${districtPath}/schools`).add(pruneUndefined(schoolData))
    const snap = await createdSchool.get()
    return response.json({ id: snap.id, ...snap.data() })
  } catch (error) {
    return response.status(400).json({ ...error })
  }
})

schoolsRouter.put('/:schoolId', async (request, response) => {
  try {
    await tokenMatchesOneOfRoles(request.token, 'admin', 'district_admin', 'owner')
  } catch (error) {
    return response.status(401).json({ ...error })
  }

  const schoolPath = request.schoolPath

  if (!schoolPath) {
    return response.status(404).json({ error: 'School path must be specified' })
  }
  const schoolData: SchoolSchema = { ...request.body }

  try {
    await admin.db.doc(schoolPath).set(pruneUndefined(schoolData), { merge: true })

    return response.status(200)
  } catch (error) {
    return response.status(400).json({ ...error })
  }
})

export default schoolsRouter