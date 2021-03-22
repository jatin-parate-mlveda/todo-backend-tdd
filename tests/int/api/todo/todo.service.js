const { expect } = require('chai');
const {
  Document,
  Types: { ObjectId },
  Error: { ValidatorError, ValidationError, CastError },
} = require('mongoose');

const {
  describe,
  it,
  before,
  afterEach,
} = require('mocha');

const User = require('../../../../src/api/user/user.model');
const Todo = require('../../../../src/api/todo/todo.model');
const {
  createTodo,
  updateTodoByIdAndUser: updateTodo,
  deleteTodoByIdAndUserId: deleteTodo,
} = require('../../../../src/api/todo/todo.service');
const { createUser } = require('../../../../src/api/user/user.service');
const { resStrings } = require('../../../../src/common/constants');

/** @type {import('../../../../src/api/user/user').UserCreateData} */
const userDetails = {
  password: 'japarate',
  email: 'jatin.parate@mlveda.com',
  name: 'jatin parate',
};

/** @type {import('../../../../src/api/todo/todo').TodoCreateData} */
const todoDetails = {
  title: 'Task',
};

let createdUser;

/**
 * @param {import('../../../../src/api/todo/todo').TodoDocument} todo
 */
const verifyTodo = (todo) => {
  const { dueDate, title, user } = todoDetails;
  expect(todo).not.to.be.null;
  expect(todo)
    .to.be.instanceof(Document);
  expect(todo)
    .to.have.property('title')
    .to.be.a('string')
    .to.be.equal(title);
  if (todo.dueDate) {
    expect(todo.dueDate)
      .to.be.instanceOf(Date);
    expect(todo.dueDate.toString())
      .to.be.equal(dueDate.toString());
  }
  expect(todo)
    .to.have.property('user')
    .to.be.instanceOf(ObjectId);
  expect(todo.user.toHexString())
    .to.be.equal(user.toHexString());
  expect(todo)
    .to.have.property('priority')
    .to.be.oneOf([1, 2, 3]);
};

module.exports = () => describe('todo.service/', () => {
  before(async () => {
    await Promise.all([
      User.deleteMany({}),
      Todo.deleteMany({}),
    ]);
    createdUser = await createUser(userDetails);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    todoDetails.dueDate = dueDate;
    todoDetails.user = createdUser._id;
  });

  afterEach(async () => {
    await Todo.deleteMany({});
  });

  describe('createTodo', () => {
    it('should create todo', async () => {
      const createdTodo = await createTodo(todoDetails);
      verifyTodo(createdTodo);
    });

    it('should fail if no title', async () => {
      try {
        await createTodo({ ...todoDetails, title: null });
        throw 'passed for null title';
      } catch (error) {
        if (error === 'passed for null title') {
          throw error;
        }

        expect(error)
          .to.be.instanceOf(ValidationError);
        expect(error.errors)
          .to.have.property('title')
          .to.be.instanceOf(ValidatorError)
          .to.have.property('message', resStrings.todo.noTitle);
      }
    });

    it('should fail if no user', async () => {
      try {
        await createTodo({ ...todoDetails, user: null });
        throw 'passed for null user';
      } catch (error) {
        if (error === 'passed for null user') {
          throw error;
        }

        expect(error)
          .to.be.instanceOf(ValidationError);
        expect(error.errors)
          .to.have.property('user')
          .to.be.instanceOf(ValidatorError)
          .to.have.property('message', resStrings.todo.noUser);
      }
    });

    it('should fail if invalid user id', async () => {
      const errorStr = 'passed for invalid user id';
      try {
        await createTodo({ ...todoDetails, user: 'invalid' });
        throw errorStr;
      } catch (error) {
        if (error === errorStr) {
          throw error;
        }

        expect(error)
          .to.be.instanceOf(ValidationError);
        expect(error.errors)
          .to.have.property('user')
          .to.be.instanceOf(CastError);
      }
    });

    it('should fail if invalid dueDate', async () => {
      const errorStr = 'passed for invalid dueDate';
      try {
        await createTodo({ ...todoDetails, dueDate: 'invalid' });
        throw errorStr;
      } catch (error) {
        if (error === errorStr) {
          throw error;
        }

        expect(error)
          .to.be.instanceOf(ValidationError);
        expect(error.errors)
          .to.have.property('dueDate')
          .to.be.instanceOf(CastError);
      }
    });
  });

  describe('updateTodoByIdAndUser', () => {
    it('should update todo', async () => {
      const dueDateToCreate = todoDetails.dueDate;
      dueDateToCreate.setDate(dueDateToCreate.getDate() - 5);
      const { _id: id } = await createTodo({
        user: todoDetails.user,
        title: 'otherTitle',
        dueDate: dueDateToCreate,
      });
      const updatedTodo = await updateTodo(
        id,
        todoDetails.user,
        {
          title: todoDetails.title,
          dueDate: todoDetails.dueDate,
        },
      );
      verifyTodo(updatedTodo);
    });
  });

  describe('deleteTodoByIdAndUserId', () => {
    it('should delete todo', async () => {
      const { _id: todoId } = await createTodo(todoDetails);
      const deletedTodo = await deleteTodo(todoId, todoDetails.user);
      const result = await Todo.findById(todoId);
      expect(result).to.be.null;
      verifyTodo(deletedTodo);
    });
  });
});
