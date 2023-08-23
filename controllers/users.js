/* eslint-disable arrow-body-style */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const AuthorisationError = require('../errors/AuthorisationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestErrorr = require('../errors/BadRequestError');

const secretKey = process.env.SECRET_KEY || 'some-secret-key';

const { errorMessage } = require('../utils/errorMessage');

const {
  users: {
    errorCreateDataUser, // : 'Попробуйте ввести другие данные для регистрации',
    errorUserEmail, // : 'Переданы некорректные данные',
    errorDataProfile, // : 'Переданы некорректные данные при обновлении профиля',
    userNotFound, // : 'Запрашиваемый пользователь не найден',
  },
} = errorMessage;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({ token, user });
    })
    .catch(next);
};

const logOut = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
    .send({ message: 'Cookie удалена' });
  next();
};

const createUser = (req, res, next) => {
  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .status(201)
        .send({ token, user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorCreateDataUser));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestErrorr(errorUserEmail));
      } else {
        next(err);
      }
    });
};

// логика запросов данных пользователя
const dataUser = (id, res, next) => User.findById(id)
  .then((user) => {
    if (user) {
      return res.status(200).send({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
    }

    throw new NotFoundError(userNotFound);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestErrorr(errorDataProfile));
    } else {
      next(err);
    }
  });

const getDataUser = (req, res, next) => {
  const id = req.user._id;
  dataUser(id, res, next);
};

// логика обновления данных пользователя
const updateUser = (newData, req, res, next) => {
  const id = req.user._id;
  return User.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        return res.status(200).send({
          email: user.email,
          name: user.name,
        });
      }

      throw new NotFoundError(userNotFound);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrorr(userNotFound));
      } else {
        next(err);
      }
    });
};

const updateDataUser = (req, res, next) => {
  const { email, name } = req.body;
  updateUser({ email, name }, req, res, next);
};

module.exports = {
  login,
  //  getUsers,
  createUser,
  getDataUser,
  updateDataUser,
  logOut,
};
