const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ShortLink = require('../model/shortLink');
const createHttpError = require('http-errors');

router.get('/:query', async (req, res, next) => {
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
    // increase redirect count
    ShortLink.findByIdAndUpdate(sl._id, { $inc: { redirectCount: 1 } }).exec();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
