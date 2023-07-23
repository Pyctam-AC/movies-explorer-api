const router = require('express').Router();
const { createUserJoi, loginJoi } = require('../middlewares/joiAuth');

const {
  login,
  createUser,
} = require('../controllers/users');

router.post(
  '/signin',
  loginJoi,
  login,
);

router.post(
  '/signup',
  createUserJoi,
  createUser,
);

module.exports = router;
