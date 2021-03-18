const { Schema, model } = require('mongoose');

const ShortLinkSchema = Schema(
  {
    url: Schema.Types.String,
    query: { type: Schema.Types.String, minLength: 6 },
    user: Schema.Types.ObjectId,
    isDeleted: { type: Schema.Types.Boolean, default: false },
    isDisable: { type: Schema.Types.Boolean, default: false },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
ShortLinkSchema.virtual('redirect').get(function () {
  return process.env.REDIRECT_HEAD + this.query;
});
module.exports = model('ShortLink', ShortLinkSchema);
