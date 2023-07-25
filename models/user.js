/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthorisationError = require('../errors/AuthorisationError');

// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    //    default: '',
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /\w+@\w+\.\w+/.test(v),
      message: 'Не корректный email-адрес',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorisationError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorisationError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

// убираем пароль из ответа при создании пользователя
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
