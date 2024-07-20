const jwt = require('jsonwebtoken')
const User = require('../models/users')

const getUserFrom = async(request,response,next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '')
      const decodedToken = jwt.verify(token, process.env.SECRET)
      request.user = await User.findById(decodedToken.id)
    }
    else{
        request.user = null
    }

    next();
  }

  module.exports = getUserFrom