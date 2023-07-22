const { celebrate, Joi } = require('celebrate');

const updateNameUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports = { updateNameUser };
