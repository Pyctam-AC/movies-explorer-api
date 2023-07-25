const errorMessage = {
  users: {
    errorCreateDataUser: 'Попробуйте ввести другие данные для регистрации',
    errorUserEmail: 'Переданы некорректные данные',
    errorDataProfile: 'Переданы некорректные данные при обновлении профиля',
    userNotDefined: 'Пользователь не существует, либо был удален',
    userNotFound: 'Запрашиваемый пользователь не найден',
  },
  movies: {
    errorDataСreatingMovie: 'Переданы некорректные данные для фильма',
    movieNotFound: 'Такого фильма нет',
    movieNotDefined: 'Запрашиваемый фильм не найден',
    errorDeleteMovie: 'Можно удялять только свой сохраненный фильм',
  },
};

module.exports = {
  errorMessage,
};
