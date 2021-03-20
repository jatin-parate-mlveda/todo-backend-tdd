const {
  describe,
  it,
  before,
  afterEach,
} = require('mocha');
const { expect } = require('chai');
const { Error: { ValidationError } } = require('mongoose');
const User = require('../../../../src/api/user/user.model');
const hashPassword = require('../../../../src/common/hashPassword');
const {
  createUser,
  getUserByEmail,
  updateUserById,
} = require('../../../../src/api/user/user.service');
const { resStrings } = require('../../../../src/common/constants');

/** @type {import('../../../../src/api/user/user').UserCreateData} */
const userDetails = {
  password: 'japarate',
  email: 'jatin.parate@mlveda.com',
  name: 'jatin parate',
};

let hashedPassword;

/**
 * @param {import('../../../../src/api/user/user').UserDocument} user
 */
const verifyUser = (user) => {
  expect(user).to.exist;
  expect(user)
    .to
    .have
    .property('name', userDetails.name);
  expect(user)
    .to
    .have
    .property('password', hashedPassword);
  expect(user)
    .to
    .have
    .property('email', userDetails.email);
  expect(user)
    .to
    .have
    .property('avatar')
    .to.be.a('string')
    .not.to.be.empty;
};

module.exports = () => describe('user.service', () => {
  before(async () => {
    const [result] = await Promise.all([
      hashPassword(userDetails.password),
      User.deleteMany({}),
    ]);
    hashedPassword = result;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      await createUser(userDetails);
      const createdUser = await User.findOne({ email: userDetails.email });
      verifyUser(createdUser);
    });

    it('should fail for duplicate email', async () => {
      await createUser(userDetails);
      try {
        await createUser(userDetails);
        throw 'passed for duplicate email id';
      } catch (error) {
        if (error === 'passed for duplicate email id') {
          throw error;
        }

        expect(error)
          .to
          .be
          .instanceOf(Error);
        expect(error)
          .to
          .have
          .property('name', 'MongoError');
        expect(error)
          .to
          .have
          .property('keyValue')
          .to
          .have
          .property('email', userDetails.email);
        expect(error)
          .to
          .have
          .property('keyPattern')
          .to
          .have
          .property('email')
          .to
          .be
          .equal(1);
        expect(error)
          .to
          .have
          .property('code', 11000);
      }
    });

    it('should fail for invalid email', async () => {
      try {
        await createUser({
          ...userDetails,
          email: 'invalid email',
        });
        throw 'passed for invalid email';
      } catch (error) {
        if (error === 'passed for invalid email') {
          throw error;
        }
        expect(error)
          .to
          .be
          .instanceOf(ValidationError);
      }
    });

    it('should fail if no values provided', async () => {
      try {
        // noinspection JSCheckFunctionSignatures
        await createUser();
        throw 'passed even if no values provided';
      } catch (error) {
        if (error === 'passed even if no values provided') {
          throw error;
        }
        expect(error)
          .instanceOf(ValidationError);
        expect(error.errors)
          .to
          .have
          .property('email')
          .to.have.property('message', resStrings.user.noEmail);
        expect(error.errors)
          .to
          .have
          .property('name')
          .to.have.property('message', resStrings.user.noName);
      }
    });

    it('should fail for invalid avatar', async () => {
      const errStr = 'passed for invalid avatar';
      try {
        await createUser({ ...userDetails, avatar: 'invalid' });
        throw errStr;
      } catch (error) {
        if (error === errStr) {
          throw error;
        }

        expect(error)
          .to.be.instanceOf(ValidationError);
        expect(error.errors)
          .to.have.property('avatar')
          .to.have.property('message', resStrings.user.invalidAvatar);
      }
    });
  });

  describe('getUserByEmail', () => {
    it('should return correct user', async () => {
      await createUser(userDetails);
      const returnPromise = getUserByEmail(userDetails.email);
      expect(returnPromise)
        .to
        .be
        .instanceOf(Promise);
      const foundUser = await returnPromise;
      verifyUser(foundUser);
    });
  });

  describe('updateUserById', () => {
    it('should update user correctly', async () => {
      const createdUser = await createUser({
        ...userDetails,
        password: 'japarate',
        name: 'jatin.parate',
      });

      const updatedUser = await updateUserById(createdUser._id, userDetails);
      verifyUser(updatedUser);
    });
  });
});
