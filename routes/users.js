const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getDataUser,
  updateDataUser,
} = require('../controllers/users');

router.get('/me', getDataUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateDataUser,
);

module.exports = router;
