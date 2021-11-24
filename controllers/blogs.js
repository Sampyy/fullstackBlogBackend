
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')


blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
  
  })

blogsRouter.get('/:id', async (request, response) => {
  try{
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      console.log('invalid id request')
      response.status(404).end()
    } 
  } catch(exception) {
      return response.status(400).send(exception)
  }
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

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    const blog = await Blog.findById(request.params.id)
    console.log(request.params.id + " aötrae")
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    return response.status(400).send(exception)
  }
  
})

  module.exports= blogsRouter