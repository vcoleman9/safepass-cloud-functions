import express from 'express'
import usersRouter from './controllers/users'
import middleware from './utils/middleware'


const app = express()

app.use(middleware.formatDocumentPaths)

app.use('/api/users', usersRouter)


export default app