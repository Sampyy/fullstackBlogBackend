const config = require('./utils/config')
const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')



app.use(express.static('build'))







mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch((error) => {
    logger.error('error connection to mongoDB: ', error.message)
  })

app.use(cors())
app.use(express.json())
const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})