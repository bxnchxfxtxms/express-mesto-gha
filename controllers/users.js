const User = require('../models/user');

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DefaultError';
    this.statusCode = 500;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError'
    this.statusCode = 400
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

const profileUpdateError = new ValidationError("Переданы некорректные данные приобновлении профиля")
const avatarUpdateError = new ValidationError("Переданы некорректные данные приобновлении аватара")
const validationError = new ValidationError("Переданы некорректные данные при создании пользователя")
const notFoundError = new NotFoundError("Пользователь с указанным id не найден")
const defaultError = new DefaultError("Произошла ошибка")

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({ data: users }))
  .catch(() => {
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
  })
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
  .then(user => res.send({
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user.id
  }))
  .catch(err => {
    if (err.name === 'TypeError' || 'CastError') {
      return res.status(notFoundError.statusCode).send({
        message: notFoundError.message
      })
    }
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
})
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(validationError.statusCode).send({
        message: validationError.message
      })
    }
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
  })
}

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body

  User.findByIdAndUpdate(req.user._id, { name, about })
  .then(user => {
    if ((name.length <= 2 || name.length >= 30) || (about.length <=2 || about.length >= 30)) {
      return res.status(profileUpdateError.statusCode).send({
        message: profileUpdateError.message
      })
    }
    res.send({ data: user })})
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(notFoundError.statusCode).send({
        message: notFoundError.message
      })
    }
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
  })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
  .then(user => res.send({ data: user }))
  .catch(err => {
    console.log(err.name)
    if (err.name === 'ValidationError') {
      return res.status(avatarUpdateError.statusCode).send({
        message: avatarUpdateError.message
      })
    } else if (err.name === 'CastError') {
      return res.status(notFoundError.statusCode).send({
        message: notFoundError.message
      })
    }
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
  })
}