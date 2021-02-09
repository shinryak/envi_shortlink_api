const { Schema, model } = require('mongoose');

const ShortLinkSchema = Schema({
  url: Schema.Types.String,
  query: { type: Schema.Types.String, minLength: 6 },
  user: Schema.Types.ObjectId,
  isDeleted: { type: Schema.Types.Boolean, default: false },
  isDisable: { type: Schema.Types.Boolean, default: false },
});

module.exports = model('ShortLink', ShortLinkSchema);
