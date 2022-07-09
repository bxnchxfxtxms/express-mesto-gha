const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

const linkNotFoundError = new NotFoundError("Адрес не найден")

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/mestodb')

temporaryAuthorization = (req, res, next) => {
  req.user = {
    _id: '62c58ae7072c29a962b8022a'
  }
  next()
}

checkRoute = (req, res, next) => {
  if (req.path.split('/')[1] !== 'users' && req.path.split('/')[1] !== 'cards') {
    return res.status(linkNotFoundError.statusCode).send({
      message: linkNotFoundError.message
    })
  }
  next()
}

app.use(checkRoute)

app.use(temporaryAuthorization);
app.use('/users', require('./routes/users'));

app.use(temporaryAuthorization);
app.use('/cards', require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
