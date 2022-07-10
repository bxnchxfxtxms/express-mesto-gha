const Card = require('../models/card');

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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании/удалении карточки',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Карточка с указанным id не найдена',
        });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании/удалении карточки',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Передан несуществующий id карточки',
        });
      }
      return res.send({ card });
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
      return res.send({ card });
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
