
const blogsRouter = require('express').Router()
const { findById } = require('../models/blog.js')
const Blog = require('../models/blog.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


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
 
  console.log("in post")
  console.log(request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } 
  const user = await User.findById(decodedToken.id)

  const body = request.body
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })


    const savedBlog = await blog.save()
    console.log("here "  + user)
    const newBlogs = user.blogs.concat(savedBlog._id)
    console.log("again "  + user)
    await User.findByIdAndUpdate(decodedToken.id, { blogs: newBlogs})

    response.json(savedBlog.toJSON())
 
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