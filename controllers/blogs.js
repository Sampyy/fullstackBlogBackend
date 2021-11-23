
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')


blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
  
  })
  
blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  blog.likes = blog.likes || 0

  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception){
    return response.status(400).send(exception)
  }
      console.log(blog)
  })

  module.exports= blogsRouter