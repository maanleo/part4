const usersRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    if(password.length < 3){
        return response.status(400).json({ error: `User validation failed: username: Path password is shorter than the minimum allowed length (3)` })
    }
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })

    console.log(user);
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  })

  usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
  })
  
module.exports = usersRouter