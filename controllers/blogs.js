
const blogsRouter = require('express').Router()
const { findById } = require('../models/blog.js')
const Blog = require('../models/blog.js')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
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
  
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  blog.likes = blog.likes || 0
  const users = await User.find({})
  user = users[0]
  blog.user = user

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog.toJSON())
  } catch(exception){
    return response.status(400).send(exception)
  }
      console.log(blog)
  })

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const newLikes = body.likes + 1

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: newLikes
  }

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog)
    const newBlog = await Blog.findById(request.params.id)
    response.json(newBlog.toJSON())
  } catch (exception) {
    return response.status(400).send(exception)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    return response.status(400).send(exception)
  }
  
})

  module.exports= blogsRouter