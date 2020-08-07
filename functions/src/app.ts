import express from 'express'
import usersRouter from './controllers/users'
import middleware from './utils/middleware'
import districtsRouter from './controllers/districts'
import schoolsRouter from './controllers/schools'
import roomsRouter from './controllers/rooms'
import studentsRouter from './controllers/students'

const app = express()

app.use(middleware.formatDocumentPaths)

app.use('/api/users', usersRouter)
app.use('/api/districts', districtsRouter)
app.use('/api/schools', schoolsRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/students', studentsRouter)

export default app