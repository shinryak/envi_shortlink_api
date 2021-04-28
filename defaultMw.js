module.exports = (req, res, next) => {
  if (!req.local) req.local = {};
  next();
};
