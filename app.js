const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND_ERROR_CODE } = require('./utils/response-codes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

const temporaryAuthorization = (req, res, next) => {
  req.user = {
    _id: '62c58ae7072c29a962b8022a',
  };
  next();
};

app.use(temporaryAuthorization);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
