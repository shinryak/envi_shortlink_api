const createHttpError = require('http-errors');

module.exports = (req, res, next) => {
  if (req.user && req.user.uid) {
    return next();
  }
  next(createHttpError(403));
};
