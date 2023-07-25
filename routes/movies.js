const router = require('express').Router();

const { createMovieJoi, deleteMovieJoi } = require('../middlewares/joiMovies');

const {
  getMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  createMovieJoi,
  createMovies,
);

router.delete(
  '/:movieId',
  deleteMovieJoi,
  deleteMovies,
);

module.exports = router;
