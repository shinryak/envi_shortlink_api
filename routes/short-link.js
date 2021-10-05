const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ShortLink = require('../model/link');
const isUserMw = require('../middleware/isUserMw');
const createHttpError = require('http-errors');

router.use('/', isUserMw);
router.get('', async (req, res, next) => {
  try {
    const { all, del } = req.query;
    if (!!all && req.user.admin) return res.send(await ShortLink.find().exec());
    else if (!!all && !req.user.admin) throw createHttpError(403);
    var condObj = {
      user: mongoose.Types.ObjectId(req.user.uid),
      isDeleted: false,
    };
    if (del) delete condObj.isDeleted;
    const query = await ShortLink.find(condObj).exec();
    return res.send(query);
  } catch (error) {
    next(error);
  }
});
/**
 * Method: POST
 * Delete link. Set field isDeteted: true
 */
router.post('/:query/delete', async (req, res, next) => {
  try {
    const { query } = req.params;
    const { _id } = req.body;
    var condObj = {
      query,
      user: req.user.uid,
      _id,
    };
    if (req.user.admin) delete condObj.user;
    if (!_id) delete condObj._id;
    const sl = await ShortLink.findOne(condObj).exec();
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
router.get('/:query/restore', async (req, res, next) => {
  try {
    const { query } = req.params;
    var condObj = {
      query,
      user: req.user.uid,
    };
    if (req.user.admin) delete condObj.user;
    const sl = await ShortLink.findOneAndUpdate(
      condObj,
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

router.post('/:query/update', async (req, res, next) => {
  try {
    const oldQuery = req.params.query;
    const { query, url } = req.body;
    var condObj = {
      query: oldQuery,
      user: req.user.uid,
    };
    if (req.user.admin) delete condObj.user;
    var updateObject = {};
    if (query) updateObject.query = query;
    if (url) updateObject.url = url;
    const sl = await ShortLink.findOneAndUpdate(condObj, updateObject, {
      new: true,
    }).exec();
    if (!sl) {
      return next(createHttpError(404, 'short-link not found'));
    }
    res.send(sl);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
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
module.exports = router;
