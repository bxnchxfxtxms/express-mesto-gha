const User = require('../models/user');

const {
  NOT_FOUND_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  CREATED_CODE,
} = require('../utils/response-codes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({
      message: 'На серевере произошла ошибка',
    }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с указанным id не найден',
        });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Передан некорректный id для поиска пользователя',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с указанным id не найден',
        });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении пользователя',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с указанным id не найден',
        });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};
