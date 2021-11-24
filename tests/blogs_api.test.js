const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
    {
        'author':'added',
        'title':'test blog',
        'url':'www.test.com'
    },
    {
        'author':'added another',
        'title':'test blog to test',
        'url':'www.test.com/2'
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () =>  {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/)
})

test('app returns correct amount of blogs', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body).toHaveLength(initialBlogs.length)
})

test('app saves id in field "id"', async () => {
    const res = await api.get('/api/blogs')
    
    expect(res.body[0].id).toBeDefined()

})

test('app can add a blog to db using post', async () => {
    const blogToAdd ={
        'author':'new blog to add',
        'title': 'a great blog',
        'url':'newblog.com'
    }

    await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAfterAdd = await api.get('/api/blogs')
    const contents = blogsAfterAdd.body.map(b => b.author)
    expect(blogsAfterAdd.body).toHaveLength(initialBlogs.length + 1)

    
    expect(contents).toContain('new blog to add')
})

test('likes default to 0 if not given in post request', async () => {
    const blogToAdd = {
        'author':'new blog to add',
        'title': 'a great blog',
        'url':'newblog.com'
    }

    await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAfterAdd = await api.get('/api/blogs')
    const contents = blogsAfterAdd.body



    expect(contents[initialBlogs.length].likes).toBe(0)
})

test('post request without title or url responds with 400 bad request', async () => {
    const blogToAdd = {
        'author':'authorthatisbad'
    }

    await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(400)
})

test('a blog can be deleted', async () => {
    const content = await api.get('/api/blogs')
    blogsBeforeDelete = content.body
    const blogToDelete = blogsBeforeDelete[0]

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

    const blogsAfterDelete = await api.get('/api/blogs').expect(200)

    expect(blogsAfterDelete.body).toHaveLength(initialBlogs.length - 1)
})




afterAll(() => {
    mongoose.connection.close()
})