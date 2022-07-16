const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const {
  NOT_FOUND_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  CREATED_CODE,
} = require('../utils/response-codes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({
      message: 'На серевере произошла ошибка',
    }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ card }))
    .catch(next);
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки/снятия лайка',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Передан несуществующий id карточки',
        });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки/снятия лайка',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};
