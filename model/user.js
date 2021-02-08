const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const UserSchema = Schema({
  username: { type: Schema.Types.String, unique: true },
  email: { type: Schema.Types.String, default: '' },
  password: { type: Schema.Types.String, default: '' },
  isDeleted: { type: Schema.Types.Boolean, default: false },
  isDisable: { type: Schema.Types.Boolean, default: false },
});
UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toSimpleInfoObject = function () {
  let user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.password;
  delete user.isDeleted;
  delete user.isDisable;
  // delete user.lastSuccess;
  // delete user.lastFail;
  // delete user.lastLogIn;
  // delete user.createdAt;
  // delete user.updatedAt;
  delete user.__v;
  return user;
};
module.exports = model('User', UserSchema);
