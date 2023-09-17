const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
    },
  },
);

const User = mongoose.model('user', userSchema);

module.exports = { User };