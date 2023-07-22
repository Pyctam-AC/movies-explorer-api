const router = require('express').Router();

const { updateNameUser } = require('../middlewares/joiUsers');

const {
  getDataUser,
  updateDataUser,
} = require('../controllers/users');

router.get('/me', getDataUser);

router.patch(
  '/me',
  updateNameUser,
  updateDataUser,
);

module.exports = router;
