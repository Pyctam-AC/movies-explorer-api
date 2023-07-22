// const httpConstants = require('http2').constants;
const Movie = require('../models/movie');

const BadRequestErrorr = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

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
    duration: req.user.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.user.image,
    trailer: req.body.trailer,
    nameRU: req.body.nameRU,
    nameEN: req.user.nameEN,
    thumbnail: req.body.thumbnail,
    movieId: req.user.movieId,
  })
    .then((movies) => {
      res.status(201).send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErrorr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovies = (req, res, next) => {
  const id = req.user._id;

  return Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такокого фильма нет');
      }
      if (movie.owner.toString() === id) {
        return movie.deleteOne()
          .then((removeMovie) => res.status(200).send(removeMovie));
      }

      throw new ForbiddenError('Можно удалять только свой фильм');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErrorr('Некорректный id фильма'));
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
