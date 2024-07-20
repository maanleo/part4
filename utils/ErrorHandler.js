function errorHandler(err,req,res,next){
    console.error(err);
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
      } else if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message })
    } else if (err.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    next(err);
}

module.exports = errorHandler