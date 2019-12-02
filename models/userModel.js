// BUILT-IN MODULE
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Don't be shy, tell us your name`]
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'You have to create a strong and awesome password'],
    minLength: 8,
    // To not show in any output
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  // Only run this function if the password was actually modified
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the confirm field from our database
  this.passwordConfirm = undefined;
  next();
});

// Instance Method
// We did the bcrypt.compare in the model cause bcrypt was already here, and it's related to the usersModels itself
// The main objective of this method is to return true or false
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
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

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(
    {
      resetToken
    },
    this.passwordResetToken
  );

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
