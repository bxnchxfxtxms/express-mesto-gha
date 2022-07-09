const Card = require('../models/card');

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

const cardDeleteError = new NotFoundError("Карточка с указанным id не найдена")
const likeButtonError = new NotFoundError("Передан несуществующий id карточки")
const validationError = new ValidationError("Переданы некорректные данные при создании карточки")
const defaultError = new DefaultError("Произошла ошибка")

module.exports.getCards = (req, res) => {
  Card.find({})
  .then(cards => res.send({ data: cards }))
  .catch(() => {
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
  })
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
  .then(card => res.send({ data: card }))
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

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
  .then(card => {
    console.log(!card)
    if (!card) {
      return res.status(cardDeleteError.statusCode).send({
        messge: cardDeleteError.message
      })
    }
    res.send({ data: card })
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(cardDeleteError.statusCode).send({
        messge: cardDeleteError.message
      })
    }
    return res.status(defaultError.statusCode).send({
      message: defaultError.message
    })
  })
}

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
)