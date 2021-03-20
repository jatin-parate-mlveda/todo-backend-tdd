const { Types: { ObjectId } } = require('mongoose');
const {
  describe,
  before,
  afterEach,
  it,
} = require('mocha');
const chai = require('chai');
const { CREATED, UNAUTHORIZED } = require('http-codes');
const User = require('../../../src/api/user/user.model');
const Todo = require('../../../src/api/todo/todo.model');
const app = require('../../../src/app/app');
const { resStrings } = require('../../../src/common/constants');
const { createUser } = require('../../../src/api/user/user.service');
const { sign } = require('../../../src/common/jwt');

const { expect } = chai;

/** @type {import('../../../src/api/user/user').UserCreateData} */
const userDetails = {
  password: 'japarate',
  email: 'jatin.parate@mlveda.com',
  name: 'jatin parate',
};

/** @type {import('../../../src/api/todo/todo').TodoCreateData} */
const todoDetails = {
  title: 'Task',
};

let createdUser;
let jwtToken;
const routePrefix = '/api/todo';

/**
 * @param {import('../../../src/api/todo/todo').Todo} todo
 */
const verifyTodo = (todo) => {
  const { dueDate, title, user } = todoDetails;
  expect(todo).not.to.be.null;
  expect(todo)
    .to.have.property('title')
    .to.be.a('string')
    .to.be.equal(title);
  if (todo.dueDate) {
    expect(todo.dueDate)
      .to.be.a('string');
    expect(new Date(todo.dueDate).toString())
      .to.be.equal(dueDate.toString());
  }
  expect(todo)
    .to.have.property('user')
    .to.be.a('string');
  expect(new ObjectId(user).toHexString())
    .to.be.equal(user.toHexString());
};

module.exports = () => describe('todo/', () => {
  before(async () => {
    await Promise.all([
      Todo.deleteMany({}),
      User.deleteMany({}),
    ]);

    createdUser = await createUser(userDetails);
    const { password, ...jwtPayload } = createdUser.toJSON();
    jwtToken = await sign(jwtPayload);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    todoDetails.dueDate = dueDate;
    todoDetails.user = createdUser._id;
  });

  afterEach(async () => {
    await Todo.deleteMany({});
  });

  describe('POST: /todo', () => {
    it('should create todo', async () => {
      const res = await chai.request(app)
        .post(routePrefix)
        .set('Cookie', `token=${jwtToken}`)
        .send(todoDetails);

      expect(res)
        .to.be.json;
      expect(res).to.have.status(CREATED);
      expect(res.body)
        .to.have.property('todo')
        .to.be.an('object');
      verifyTodo(res.body.todo);
    });

    it('should return unauthorized error', async () => {
      const res = await chai.request(app)
        .post(routePrefix)
        .send(todoDetails);

      expect(res)
        .to.be.json;
      expect(res).to.have.status(UNAUTHORIZED);
      expect(res.body)
        .to.have.property('error')
        .to.be.an('object')
        .to.have.property('message', resStrings.unAuthorized);
    });
  });
});
