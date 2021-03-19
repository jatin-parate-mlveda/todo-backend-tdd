const {
  model,
  Schema,
} = require('mongoose');
const {
  isEmail,
  isURL,
} = require('validator');
const gravatar = require('gravatar');
const { resStrings } = require('../../common/constants');

/** @type {import('./user').UserSchema} */
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, resStrings.user.noEmail],
      unique: true,
      validate: [isEmail, resStrings.user.invalidEmail],
    },
    password: {
      type: String,
      required: [true, resStrings.user.noPassword],
    },
    name: {
      type: String,
      required: [true, resStrings.user.noName],
    },
    avatar: {
      type: String,
      required: [true, resStrings.user.noAvatar],
      validate: [
        isURL,
        resStrings.user.invalidAvatar,
      ],
      default() {
        return gravatar.url(this.email, {
          protocol: 'https', d: 'identicon', rating: 'g', size: 200,
        });
      },
    },
  },
  { versionKey: false },
);

const User = model('users', userSchema);

module.exports = User;
