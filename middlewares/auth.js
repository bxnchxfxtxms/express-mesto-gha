const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED_ERROR_CODE,
} = require('../utils/response-codes');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, '1qa2ws3ed4rf5tg6yh');
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
