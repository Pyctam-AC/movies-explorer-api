// const httpConstants = require('http2').constants;
const Movie = require('../models/movie');

const BadRequestErrorr = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const { errorMessage } = require('../utils/errorMessage');

const {
  movies: {
    errorDataСreatingMovie, // : 'Переданы некорректные данные для фильма',
    movieNotFound, // : 'Такого фильма нет',
    movieNotDefined, // : 'Запрашиваемый фильм не найден',
    errorDeleteMovie, // : 'Можно удялять только свой сохраненный фильм',
  },
} = errorMessage;

const getMovies = (req, res, next) => {
  Movie
    .find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  Movie.create({
    country: req.body.country,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thumbnail: req.body.thumbnail,
    movieId: req.body.movieId,
    owner: req.user._id,
  })
    .then((movies) => {
      res.status(201).send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrorr(errorDataСreatingMovie));
      } else {
        next(err);
      }
    });
};

const deleteMovies = (req, res, next) => {
  const id = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFound);
      }
      if (movie.owner.toString() === id) {
        return movie.deleteOne()
          .then((removeMovie) => res.status(200).send(removeMovie));
      }

      throw new ForbiddenError(errorDeleteMovie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErrorr(movieNotDefined));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
