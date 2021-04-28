const { default: parseBearerToken } = require('parse-bearer-token');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const token = parseBearerToken(req);
    var decoded = jwt.verify(token, process.env.SECRET);
    req.local.user = decoded;
  } catch (err) {
    req.local.user = null;
  }
  next();
};
