
const blogsRouter = require('express').Router()
const { findById } = require('../models/blog.js')
const Blog = require('../models/blog.js')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware.js')




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
  
blogsRouter.post('/',userExtractor, async (request, response) => {

  const body = request.body
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    user: request.user._id
  })


    const savedBlog = await blog.save()
    const newBlogs = request.user.blogs.concat(savedBlog._id)
    await User.findByIdAndUpdate(request.user._id, { blogs: newBlogs})

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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {


  try {
    await Blog.findByIdAndRemove(request.params.id)
    const newBlogs = request.user.blogs
    for (var i = 0; i < newBlogs.length ; i++) {
      if (newBlogs[i].toString() === request.params.id) {
        
        newBlogs.splice(i,1)
        break
      }
    }
    await User.findByIdAndUpdate(request.user._id, { blogs: newBlogs})
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    return response.status(400).send(exception)
  }
  
})

  module.exports= blogsRouter