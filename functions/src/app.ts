import express from 'express'
import usersRouter from './controllers/users'
import middleware from './utils/middleware'
import districtsRouter from './controllers/districts'

const app = express()

app.use(middleware.formatDocumentPaths)

app.use('/api/users', usersRouter)
app.use('/api/districts', districtsRouter)

export default app