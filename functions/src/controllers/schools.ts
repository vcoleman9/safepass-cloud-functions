import { SchoolSchema } from './../models/school'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const schoolsRouter = express.Router()

schoolsRouter.post('/', async (request, response) => {
  // TODO: Use token to extract district from user if its not supplied in the body
  const district = request.body.district

  const schoolData: SchoolSchema = {
    name: request.body.name
  }

  if (!schoolData.name) {
    return response.status(400).json({ error: 'A school must have a name' })
  } else if (!district) {
    return response.status(400).json({ error: 'A school must have a district' })
  }

  const createdSchool = await admin.db.doc(district).collection('schools').add(pruneUndefined(schoolData))
  return response.json({ schoolPath: createdSchool.path })
})

export default schoolsRouter