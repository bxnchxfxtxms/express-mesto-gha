const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const unauthorizedError = new UnauthorizedError('Необходима авторизация');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res
      .status(unauthorizedError.statusCode)
      .send({ message: unauthorizedError.message });
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, '1qa2ws3ed4rf5tg6yh');
  } catch (err) {
    return res
      .status(unauthorizedError.statusCode)
      .send({ message: unauthorizedError.message });
  }

  req.user = payload;

  return next();
};
