const mongoose = require('mongoose');
const validator = require('validator');
const jsonwebtoken = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }, ],
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(user, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jsonwebtoken.sign({
    _id: user._id.toHexString(),
    access
  }, 'nihar').toString();

  user.tokens.push({
    access,
    token,
  });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this; //static methods are called with model as binding.
  let decoded;

  try {
    decoded = jsonwebtoken.verify(token, 'nihar')
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
};
