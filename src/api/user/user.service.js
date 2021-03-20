const hashPassword = require('../../common/hashPassword');
const User = require('./user.model');

/** @param {import('./user').UserCreateData} userData */
const createUser = async (userData = {}) => await User.create(
  { ...userData, password: await hashPassword(userData.password) },
);

/**
 * @param {string} email
 * @returns {Promise<null | import('./user').UserDocument>}
 */
const getUserByEmail = async (email) => await User.findOne({ email });

/**
 * @param {import('mongoose').Types.ObjectId | string} userId
 * @param {Partial<import('./user').User>} userDetails
 */
const updateUserById = async (
  userId,
  userDetails = {},
) => {
  const docToUpdate = userDetails;
  if (userDetails.password) {
    docToUpdate.password = await hashPassword(userDetails.password);
  }

  return await User.findByIdAndUpdate(
    userId,
    docToUpdate,
    {
      runValidators: true,
      new: true,
    },
  );
};

module.exports = {
  createUser, getUserByEmail, updateUserById,
};
