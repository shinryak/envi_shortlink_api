const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ShortLink = require('../model/link');
const isUserMw = require('../middleware/isUserMw');
const createHttpError = require('http-errors');
const { route } = require('./redirect');

router.get('/:query', async (req, res, next) => {
  try {
    const { query } = req.params;
    console.log(query);
    const sl = await ShortLink.findOne({ query }).exec();
    if (!sl) {
      return next(createHttpError(404));
    }
    const { url } = sl;
    res.send({ url });
  } catch (error) {
    next(error);
  }
});
router.get('/r/:query', async (req, res, next) => {
  try {
    const { query } = req.params;
    const sl = await ShortLink.findOne({
      query,
      isDeleted: { $ne: true },
    }).exec();
    if (!sl) {
      return res.render('error', {
        error: createHttpError(404, 'Link not found or deleted'),
      });
    }
    const { url } = sl;
    res.redirect(url);
  } catch (error) {
    next(error);
  }
});
router.use('/', isUserMw);
router.post('/add', async (req, res, next) => {
  try {
    const { url, query } = req.body;
    const shortLink = ShortLink({
      url,
      query,
      user: mongoose.Types.ObjectId(req.user.uid),
    });
    await shortLink.save();
    res.status(200).send(shortLink);
  } catch (error) {
    next(error);
  }
});
router.patch('/:query/edit', async (req, res, next) => {
  try {
    const { query } = req.params;
    const sl = await ShortLink.findOne({ query }).exec();
    if (!sl) {
      return next(createHttpError(404));
    }
    sl.query = query;
    await sl.save();
    res.send(sl);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
