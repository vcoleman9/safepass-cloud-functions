import { SchoolSchema } from './../models/school'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const schoolsRouter = express.Router()

schoolsRouter.post('/', async (request, response) => {
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
    return response.status(400).json({ error: error.code })
  }
})

// schoolsRouter.put('/', async (request, respose) => {
//   // TODO: Use token to extract district from user if it's not supplied in the body
//   const school = request.body.school

//   const schoolData: SchoolSchema = {
//     name: request.body.name
//   }

//   const updatedSchool
// })

export default schoolsRouter