const { mongoose } = require('../db_connection')

const blogSchema = new mongoose.Schema({
  title: {
      type:String,
      minLength: 3,
      required: true
    },
  author: {
      type:String,
      minLength: 3,
      required: true
    },
  url: {
      type:String,
      required: true
    },
  likes: 
    { 
      type:Number,
      min:0,
      required:true
    },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})
  

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Blog', blogSchema)