const blogRouter = require('express').Router()
const Blog = require('../models/blogs')


blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async(request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user


  if(!request.body.likes){
    request.body.likes = 0;
  }

  const blog = new Blog({...request.body,user:user._id})
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id',async(request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id);
  const blogUserId = blogToDelete.user?.toString();
  if(user.id.toString() === blogUserId){
    await Blog.deleteOne(blogToDelete);
    response.status(204).end()
  }
  else{
    response.status(401).end();
  }
})

blogRouter.patch('/:id',async(request,response)=>{
   const result = await Blog.findByIdAndUpdate(request.params.id,{
    likes:request.body.likes
  },{new:true});
  response.status(201).json(result);
})

module.exports = blogRouter