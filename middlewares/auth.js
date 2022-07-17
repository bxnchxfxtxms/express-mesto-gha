const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, '1qa2ws3ed4rf5tg6yh');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
