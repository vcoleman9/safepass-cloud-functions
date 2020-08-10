import { StudentSchema } from './../models/student'
import express from 'express'
import admin from '../firestoreAuthentication'
import { pruneUndefined } from '../utils/functions'

const studentsRouter = express.Router()

// To follow REST principals, the school path must be in the url for uniquely identifying
// and separately it must be in the body because the school is part of the resource/in the doc.
studentsRouter.post('/', async (request, response) => {
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
    return response.status(401).json({ error })
  }

  const schoolPath = request.schoolPath
  const school = request.body.school

  if (!schoolPath && !school) {
    return response.status(404).json({ error: 'School path must be specified as request parameter and in the request body' })
  } else if (!schoolPath) {
    return response.status(404).json({ error: 'School path must be specified as request parameter' })
  } else if (!school) {
    return response.status(404).json({ error: 'School path must be specified in the request body' })
  } else if (schoolPath !== school) {
    return response.status(404).json({ error: 'The school path parameter does not match the path in the request body' })
  }

  const studentData: StudentSchema = {
    school: school && admin.db.doc(school),
    ...request.body
  }

  if (!studentData.displayName) {
    return response.status(400).json({ error: 'A student must have a display name' })
  }

  try {
    const createdStudent = await admin.db.collection(`${schoolPath}/students`).add(pruneUndefined(studentData))
    const snap = await createdStudent.get()
    return response.json({ id: snap.id, ...snap.data() })
  } catch (error) {
    return response.status(400).json({ ...error })
  }
})

export default studentsRouter