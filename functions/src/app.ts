import express from 'express'
import usersRouter from './controllers/users'
import middleware from './utils/middleware'
import districtsRouter from './controllers/districts'
import schoolsRouter from './controllers/schools'
import roomsRouter from './controllers/rooms'
import studentsRouter from './controllers/students'

const app = express()

app.use(middleware.formatDocumentPaths)

app.use('/users', usersRouter)
app.use('/districts', districtsRouter)
app.use('/schools', schoolsRouter)
app.use('/rooms', roomsRouter)
app.use('/students', studentsRouter)

export default app