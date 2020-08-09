import express from 'express'
import usersRouter from './controllers/users'
import districtsRouter from './controllers/districts'
import schoolsRouter from './controllers/schools'
import roomsRouter from './controllers/rooms'
import studentsRouter from './controllers/students'
import cors from 'cors'

const app = express()

app.use(cors())

app.use('/users', usersRouter)
app.use('/districts', districtsRouter)

app.param('districtId', async (req, _res, next, id) => {
  req.districtPath = id ? `districts/${id}` : null
  next()
})

app.use('/districts/:districtId/schools', schoolsRouter)

app.param('schoolId', async (req, _res, next, id) => {
  req.schoolPath = id && req.districtPath ? `${req.districtPath}/schools/${id}` : null
  next()
})

app.use('/districts/:districtId/schools/:schoolId/rooms', roomsRouter)
app.use('/districts/:districtId/schools/:schoolId/students', studentsRouter)


export default app