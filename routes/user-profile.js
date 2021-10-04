const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ShortLink = require('../model/shortLink');
const isUserMw = require('../middleware/isUserMw');
const createHttpError = require('http-errors');

router.use('/', isUserMw);
router.get('/my-link', async (req, res, next) => {
  try {
    const query = await ShortLink.find({
      user: mongoose.Types.ObjectId(req.local.user.uid),
    }).exec();
    return res.send(query);
  } catch (error) {
    next(error);
  }
});
/**
 * Method: DELETE
 * Delete link. Set field isDeteted: true
 */
router.delete('/my-link/:query/delete', async (req, res, next) => {
  try {
    const { query } = req.params;
    const sl = await ShortLink.findOne({
      query,
      user: req.local.user.uid,
    }).exec();
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
/**
 * Method: GET
 * Restore deleted link. Set field isDeteted: false
 */
router.get('/my-link/:query/restore', async (req, res, next) => {
  try {
    const { query } = req.params;
    const sl = await ShortLink.findOneAndUpdate(
      { query, user: req.local.user.uid },
      { isDeleted: false },
      { new: true }
    ).exec();
    if (!sl) {
      return next(createHttpError(404));
    }
    res.send(sl);
  } catch (error) {
    next(error);
  }
});

router.post('/my-link/create', async (req, res, next) => {
  try {
    const { url, query } = req.body;
    const shortLink = ShortLink({
      url,
      query,
      user: mongoose.Types.ObjectId(req.local.user.uid),
    });
    await shortLink.save();
    res.status(200).send(shortLink);
  } catch (error) {
    next(error);
  }
});

router.post('/my-link/:query/update', async (req, res, next) => {
  try {
    const oldQuery = req.params.query;
    const { query, url } = req.body;
    var updateObject = {};
    if (query) updateObject.query = query;
    if (url) updateObject.url = url;
    console.log(url);
    const sl = await ShortLink.findOneAndUpdate(
      { query: oldQuery, user: req.local.user.uid },
      updateObject,
      { new: true }
    ).exec();
    if (!sl) {
      return next(createHttpError(404, 'short-link not found'));
    }
    res.send(sl);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
