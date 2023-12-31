/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes/index');

const limiter = require('./utils/limiter');

const { linkBd } = require('./utils/linkBd');

const port = process.env.PORT || 3000;

const adressBd = process.env.NODE_ENV === 'production' ? process.env.BD : linkBd;

const app = express();

app.use(helmet());

mongoose
  .connect(adressBd, {
  // .connect(`mongodb://${adressBd}/bitfilmsdb`, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connect to bitfilmsdb');
  });

app.use(cors({
  origin:
    [

      'https://movie-sultangaliev.nomoredomains.xyz',
      `http://localhost:${port}`,
    /*    process.env.NODE_ENV === 'production'
        ? 'https://movie-sultangaliev.nomoredomains.xyz'
        : `http://localhost:${port}`, */
    ],
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(limiter);

app.use(routes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
