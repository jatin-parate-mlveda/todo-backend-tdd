const { CREATED } = require('http-codes');
const { createTodo } = require('./todo.service');

/** @type {import('@types/express').RequestHandler} */
exports.createTodoHandler = async ({ body, user }, res, next) => {
  try {
    const createdTodo = await createTodo({
      ...body,
      user: user._id,
    });
    res.status(CREATED).json({ todo: createdTodo.toJSON() });
  } catch (error) {
    next(error);
  }
};
