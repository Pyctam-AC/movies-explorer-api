/* eslint-disable arrow-body-style */
const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');

const secretKey = process.env.SECRET_KEY || 'some-secret-key';

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthorisationError('Неправильные почта или пароль'));
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new AuthorisationError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
