const { Schema, model } = require('mongoose');

const ShortLinkSchema = Schema(
  {
    url: Schema.Types.String,
    query: {
      type: Schema.Types.String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_-]{6,}$/.test(v);
        },
        message: (props) => `not valid query chain!`,
      },
    },
    user: { type: Schema.Types.ObjectId, index: true },
    isDeleted: { type: Schema.Types.Boolean, default: false },
    isDisable: { type: Schema.Types.Boolean, default: false },
    redirectCount: { type: Schema.Types.Number, default: 0 },
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
module.exports = model('Link', ShortLinkSchema);
