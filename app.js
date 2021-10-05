require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bearerToken = require('express-bearer-token');

var linkRouter = require('./routes/link');
var redirectRouter = require('./routes/redirect');
var userProfile = require('./routes/short-link');
var app = express();

var defaultMw = require('./defaultMw');
var authMw = require('./middleware/authMw');

console.log(app.get('env'));
const mongodb =
  app.get('env') === 'development' ? process.env.MONGO_DEV : process.env.MONGO;
mongoose
  .connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));
mongoose.connection.on('error', (err) => console.log(err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// cors
var whitelist = [
  'https://admin.envistv.com',
  'https://cpanel.envistv.com',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:3011',
  'http://localhost:3000',
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(bearerToken());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// global middleware
app.use(defaultMw);
app.use(authMw);

// route
app.use('/s', linkRouter);
app.use('/short-link', userProfile);
app.use('/', redirectRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send({ msg: err.message });
});

module.exports = app;
