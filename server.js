const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger('dev'));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://heroku_zkj63wj6:10ld4e4b25rsjjclsd9psmdthg@ds223343.mlab.com:23343/heroku_zkj63wj6';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require('./routes/api.js'));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});