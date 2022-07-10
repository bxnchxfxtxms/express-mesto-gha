const User = require('../models/user');

const NOT_FOUND_ERROR_CODE = 404;
const VALIDATION_ERROR_CODE = 400;
const DEFAULT_ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({
      message: 'На серевере произошла ошибка',
    }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user.id,
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с указанным id не найден',
        });
      } if (err.name === 'CastError') {
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
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user.id,
    }))
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

  const checkLength = (item) => {
    if (item) {
      return item.length <= 2 || item.length >= 30;
    }
    return null;
  };

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (checkLength(name) || checkLength(about)) {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user.id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с указанным id не найден',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user.id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: 'Пользователь с указанным id не найден',
        });
      }
      return res.status(DEFAULT_ERROR_CODE).send({
        message: 'На серевере произошла ошибка',
      });
    });
};
