const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')

mongoose.set('strictQuery', false)


console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  });

module.exports = {mongoose};