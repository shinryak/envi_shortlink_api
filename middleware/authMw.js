const fs = require('fs');
const httpError = require('http-errors');
var jwt = require('jsonwebtoken');
const publicPem = fs.readFileSync('./public.key', 'utf8');
module.exports = (req, res, next) => {
  try {
    const token = req.token;
    const verify = jwt.verify(token, publicPem);
    req.user = verify;
  } catch (error) {
    req.user = null;
  }
  next();
};
