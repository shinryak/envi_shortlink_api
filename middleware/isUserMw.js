const createHttpError = require('http-errors');

module.exports = (req, res, next) => {
  if (req.local && req.local.user && req.local.user.id) {
    return next();
  }
  next(createHttpError(403));
};
