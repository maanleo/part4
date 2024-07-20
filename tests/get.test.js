const {test,describe,beforeEach,after} = require('node:test');
const assert = require('node:assert')
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blogs')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const { default: mongoose } = require('mongoose');

const api = supertest(app);

const blogs = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7
        },
        {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5
        },
        {
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12
        },
        {
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10
        },
        {
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0
        },
        {
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2
        }  
      ];
    beforeEach(async()=>{
        await Blog.deleteMany({});
        for(const blog of blogs){
            const newBlog = new Blog(blog);
            await newBlog.save();
        }
    })
    
    test('get all blogs route tests',async()=>{
        const response = await api.get('/api/blogs/')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        .expect(function(res) {
            res.body.forEach(element => {
                if (!element.hasOwnProperty('id')) throw new Error("Expected 'id' key!");
            });
        })
        assert.strictEqual(response.body.length,blogs.length)
    })

    const postBlog =  {
      title: "Test Blog",
      author: "Bilal Maan",
      url: "https://www.google.com",
      likes: 6
    } 

    test('post new blog',async()=>{
      const reply = await api.post('/api/login').send({username:'root',password:'sekret'});
      const beforeBlogs = await api.get('/api/blogs/');
      const beforeLength = beforeBlogs.body.length;
      const response = await api.post('/api/blogs/')
      .send(postBlog)
      .expect(201)
      .set({
        'Authorization': `Bearer ${reply.body.token}`
      })
      const afterBlogs = await api.get('/api/blogs/');
      const afterLength = afterBlogs.body.length;
      assert.strictEqual(beforeLength+1,afterLength)
  })

  const missingLikes =  {
    title: "Test Blog 1",
    author: "Bilal Maan 1",
    url: "https://www.google.com"
  } 

  test('missing likes',async()=>{
    const reply = await api.post('/api/login').send({username:'root',password:'sekret'});
    const response = await api.post('/api/blogs/')
    .send(missingLikes)
    .expect(201)
    .set({
      'Authorization': `Bearer ${reply.body.token}`
    })
    const afterBlogs = await api.get('/api/blogs/');
    const afterBlog = afterBlogs.body[afterBlogs.body.length-1];
    assert.strictEqual(afterBlog.likes,0)
})

const missingTitle =  {
  author: "Bilal Maan 1",
  url: "https://www.google.com"
} 

test('missing Title',async()=>{
  const reply = await api.post('/api/login').send({username:'root',password:'sekret'});
  const response = await api.post('/api/blogs/')
  .send(missingTitle)
  .expect(400)
  .set({
    'Authorization': `Bearer ${reply.body.token}`
  })
})

test('delete one',async()=>{
  const reply = await api.post('/api/login').send({username:'root',password:'sekret'});
  await api.post('/api/blogs/')
      .send(postBlog)
      .expect(201)
      .set({
        'Authorization': `Bearer ${reply.body.token}`
      })
  const rootUser = await User.find({username:'root'}).populate('blogs');
  const blogId=rootUser[0].blogs[0]._id;
  const response = await api.delete(`/api/blogs/${blogId.toString()}`)
  .expect(204)
  .set({
    'Authorization': `Bearer ${reply.body.token}`
  })
})

test('update likes',async()=>{
  const reply = await api.post('/api/login').send({username:'root',password:'sekret'});
  const allblogs = await api.get('/api/blogs/')
  const firstId = allblogs.body[0].id;
  const response = await api.patch(`/api/blogs/${firstId}`)
  .send({likes:18})
  .expect(201);
})


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

describe('when there is initially one user in db', () => {
beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})
test('creation fails with short username', async () => {
  const usersAtStart = await usersInDb()

  const newUser = {
    username: 'ml',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})
})

    after(async()=>{
        await mongoose.connection.close()
    });
