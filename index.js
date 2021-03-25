const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
app.use(express.static('build'))
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)




app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch((error) => {
    logger.error('error connection to mongoDB: ', error.message)
  })


app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})