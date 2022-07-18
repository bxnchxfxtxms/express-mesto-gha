const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');

const {
  CREATED_CODE,
} = require('../utils/response-codes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return card;
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
      return card;
    })
    .then((card) => Card.findByIdAndRemove(card.id)
      .then((removedCard) => {
        res.status(200).send({ removedCard });
      }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.status(200).send({ card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий id карточки');
      }
      return res.status(200).send({ card });
    })
    .catch(next);
};
