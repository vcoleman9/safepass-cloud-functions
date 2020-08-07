import { StudentSchema } from './../models/student'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const studentsRouter = express.Router()

studentsRouter.post('/', async (request, response) => {
  const school = request.body.school

  const studentData: StudentSchema = {
    displayName: request.body.displayName,
    grade: request.body.grade,
    school: school && admin.db.doc(school),
    profilePictureUri: request.body.profilePictureUri,
    schoolIssuedId: request.body.schoolIssuedId,
    searchName: request.body.searchName
  }

  if (!studentData.displayName) {
    return response.status(400).json({ error: 'A student must have a display name' })
  } else if (!school) {
    return response.status(400).json({ error: 'A student must have a school' })
  }

  const createdStudent = await admin.db.doc(school).collection('students').add(pruneUndefined(studentData))
  return response.json({ studentPath: createdStudent.path })
})

export default studentsRouter