const {
  CREATED, OK, NOT_FOUND, UNPROCESSABLE_ENTITY, UNAUTHORIZED, CONFLICT,
} = require('http-codes');
const {
  describe,
  beforeEach,
  it,
} = require('mocha');
const chai = require('chai');
const app = require('../../../src/app/app');
const User = require('../../../src/api/user/user.model');
const { resStrings } = require('../../../src/common/constants');
const { createUser } = require('../../../src/api/user/user.service');
const { sign } = require('../../../src/common/jwt');

const { expect } = chai;

const userDetails = {
  password: 'japarate',
  email: 'jatin.parate@mlveda.com',
  name: 'jatin parate',
};

const verifyUserResponse = (user) => {
  expect(user).to.exist;
  expect(user)
    .to
    .have
    .property('name', userDetails.name);
  expect(user)
    .not
    .to
    .have
    .property('password');
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

const reqPathPrefix = '/api/user/';

module.exports = () => describe('user/', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST: /register', () => {
    const path = `${reqPathPrefix}register`;

    it('should register', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send(userDetails);

      expect(res).to.be.json;
      expect(res).to.have.status(CREATED);
      expect(res.body).to.have.property('user').to.be.an('object');
      verifyUserResponse(res.body.user);
    });

    it('should fail if user already exists', async () => {
      await createUser(userDetails);
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send(userDetails);

      expect(res).to.be.json;
      expect(res).to.have.status(CONFLICT);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message')
        .to.be.equal(resStrings.user.alreadyExists);
    });

    it('should fail if no email passed', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({ ...userDetails, email: null });

      expect(res).to.be.json;
      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message')
        .to.be.equal(resStrings.user.noEmail);
    });

    it('should fail if invalid email passed', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({ ...userDetails, email: 'invalid email' });

      expect(res).to.be.json;
      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message')
        .to.be.equal(resStrings.user.invalidEmail);
    });

    it('should fail if no password passed', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({ ...userDetails, password: null });

      expect(res).to.be.json;
      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message')
        .to.be.equal(resStrings.user.noPassword);
    });

    it('should fail if invalid password passed', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({ ...userDetails, password: 'sdf' });

      expect(res).to.be.json;
      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message')
        .to.be.equal(resStrings.user.minPasswordLen);
    });

    it('should fail if no name passed', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({ ...userDetails, name: null });

      expect(res).to.be.json;
      expect(res).to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message')
        .to.be.equal(resStrings.user.noName);
    });
  });

  describe('POST: /login', () => {
    const path = `${reqPathPrefix}login`;

    it('should login', async () => {
      await createUser(userDetails);
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({
          email: userDetails.email,
          password: userDetails.password,
        });
      expect(res).to.be.json;
      expect(res)
        .to
        .have
        .status(OK);
      expect(res.body)
        .to
        .have
        .property('user');
      expect(res)
        .to
        .have
        .cookie('token');
      verifyUserResponse(res.body.user);
    });

    it('should return not found if user not registered', async () => {
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({
          email: userDetails.email,
          password: userDetails.password,
        });
      expect(res).to.be.json;
      expect(res)
        .to
        .have
        .status(NOT_FOUND);
      expect(res.body)
        .to
        .have
        .property('error')
        .to
        .be
        .an('object');
      expect(res.body.error)
        .to
        .have
        .property('message')
        .to
        .be
        .equal(resStrings.user.notFound);
    });

    it('should return unauthorized for invalid password', async () => {
      await createUser(userDetails);
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({
          email: userDetails.email,
          password: 'invalid password',
        });
      expect(res)
        .to
        .have
        .status(UNAUTHORIZED);
      expect(res).to.be.json;
      expect(res.body)
        .to
        .have
        .property('error')
        .to
        .be
        .an('object');
      expect(res.body.error)
        .to
        .have
        .property('message')
        .to
        .be
        .equal(resStrings.user.invalidPassword);
    });

    it('should return unprocessable entity for no password', async () => {
      await createUser(userDetails);
      const res = await chai.request(app)
        .post(path)
        .set('Content-Type', 'application/json')
        .send({
          email: userDetails.email,
        });
      expect(res)
        .to
        .have
        .status(UNPROCESSABLE_ENTITY);
      expect(res).to.be.json;
      expect(res.body)
        .to
        .have
        .property('error')
        .to
        .be
        .an('object')
        .to
        .have
        .property('message')
        .to
        .be
        .equal(resStrings.user.noPassword);
    });
  });

  describe('PUT: /', () => {
    it('should update user', async () => {
      const { password, ...jwtPayload } = (
        await createUser({
          email: userDetails.email,
          password: 'other password',
          name: 'other name',
        })
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({
          password: userDetails.password,
          name: userDetails.name,
        });
      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(OK);
      expect(res.body)
        .to.have.property('user')
        .to.be.an('object');
      verifyUserResponse(res.body.user);
    });

    it('should return user not found error', async () => {
      const user = await createUser(userDetails);
      const { password, ...jwtPayload } = user.toJSON;
      const token = await sign(jwtPayload);
      await user.delete();

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({});

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(NOT_FOUND);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.notFound);
    });

    it('should return unauthorized error if no token in cookie', async () => {
      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Content-Type', 'application/json')
        .send();

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNAUTHORIZED);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.unAuthorized);
    });

    it('should return same user if no req body passed', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({});

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.noBodyToUpdate);
    });

    it('should return error if invalid avatar passed', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({
          avatar: 'invalid avatar',
        });
      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.invalidAvatar);
    });

    it('should return error if null name is passed', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({
          name: null,
        });

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.noName);
    });

    it('should return error if null password is passed', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({
          password: null,
        });

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.noPassword);
    });

    it('should return error if null avatar is passed', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({
          avatar: null,
        });

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.noAvatar);
    });

    it('should not update email', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .put(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send({
          email: 'jatin.parate@mlveda.com',
        });

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNPROCESSABLE_ENTITY);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.user.cantUpdateEmail);
    });
  });

  describe('DELETE: /', () => {
    it('should delete user', async () => {
      const { password, ...jwtPayload } = (
        await createUser(userDetails)
      ).toJSON();
      const token = await sign(jwtPayload);

      const res = await chai.request(app)
        .delete(reqPathPrefix)
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .send();

      const userInDb = await User.findById(jwtPayload._id);

      expect(userInDb).to.be.null;
      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(OK);
      expect(res.body)
        .to.have.property('user')
        .to.be.an('object');
      verifyUserResponse(res.body.user);
    });

    it('should return unauthorized error', async () => {
      const res = await chai.request(app)
        .delete(reqPathPrefix)
        .set('Content-Type', 'application/json')
        .send();

      expect(res)
        .to.be.json;
      expect(res)
        .to.have.status(UNAUTHORIZED);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.unAuthorized);
    });
  });
});
