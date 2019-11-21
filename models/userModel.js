const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your awesome password'],
    minLength: 8,
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password does not match your awesome password passed above'
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  // Only run this function if the password was truly modified
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the confirm field from our database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(cp, up) {
  return await bcrypt.compare(cp, up);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
