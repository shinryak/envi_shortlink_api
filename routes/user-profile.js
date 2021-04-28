const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ShortLink = require('../model/shortLink');
const isUserMw = require('../middleware/isUserMw');

router.use('/', isUserMw);
router.get('/my-link', async (req, res, next) => {
  try {
    const query = await ShortLink.find({
      user: mongoose.Types.ObjectId(req.local.user.id),
    }).exec();
    return res.send(query);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
