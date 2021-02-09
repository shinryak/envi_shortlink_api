const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ShortLink = require('../model/shortLink');
const isUserMw = require('../middleware/isUserMw');
const createHttpError = require('http-errors');

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
    const sl = await ShortLink.findOne({ query }).exec();
    if (!sl) {
      return next(createHttpError(404));
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
      user: mongoose.Types.ObjectId(req.local.user.id),
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
router.delete('/:query/delete', async (req, res, next) => {
  try {
    const { query } = req.params;
    const sl = await ShortLink.findOne({ query }).exec();
    if (!sl) {
      return next(createHttpError(404));
    }
    sl.isDeleted = true;
    await sl.save();
    res.send({ msg: 'deleted' });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
