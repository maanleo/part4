const express = require('express')
const app = express()
const cors = require('cors');
require('express-async-errors');
const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const errorHandler = require('./utils/ErrorHandler');
const loginRouter = require('./controllers/login');
const getUserFrom = require('./utils/userExtract');

app.use(cors())
app.use(express.json())
app.use(getUserFrom);
app.use('/api/blogs',blogRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
app.use(errorHandler);


module.exports = app

