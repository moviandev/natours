const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please don't be shy, tell us your name`]
  },
  photo: String,
  email: {
    type: String,
    required: [true, 'Please tell us your awesome email'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'What a shame you did not provide a valid email try again please'
    ]
  },
  password: {
    type: String,
    required: [true, 'You have to create a strong and awesome password'],
    minLength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your awesome password'],
    minLength: 8
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
