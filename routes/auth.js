var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isUserMw = require('../middleware/isUserMw');

const User = require('../model/user');
const { use } = require('./link');
/* GET users listing. */
router.get('/info', isUserMw, function (req, res, next) {
  res.send({ user: req.local.user });
});
router.post('/create', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = User({ username, password });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    var user = await User.findOne({ username });
    const isValidPassword = await user.comparePassword(password);
    if (isValidPassword) {
      user = user.toSimpleInfoObject();
      const token = jwt.sign(user, process.env.SECRET, { expiresIn: '3d' });
      return res.json({ success: true, token: token, user });
    }
    const err = new Error('password not match');
    err.status = 403;
    throw err;
  } catch (error) {
    next(error);
  }
});
module.exports = router;
