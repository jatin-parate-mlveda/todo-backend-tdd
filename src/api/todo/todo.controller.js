const { CREATED, OK } = require('http-codes');
const {
  createTodo,
  getAllByUserId,
  updateTodoByIdAndUser,
  deleteTodoByIdAndUserId,
} = require('./todo.service');

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

/** @type {import('@types/express').RequestHandler} */
exports.getAllTodosHandler = async ({ user }, res, next) => {
  try {
    const todos = await getAllByUserId(user._id.toString());
    res.status(OK).json({ todos });
  } catch (err) {
    next(err);
  }
};

/** @type {import('@types/express').RequestHandler} */
exports.updateTodoByIdHandler = async ({ body, user, params: { todoId } }, res, next) => {
  try {
    const updatedTodo = await updateTodoByIdAndUser(
      todoId,
      user._id,
      body,
    );
    res.status(OK).json({ todo: updatedTodo });
  } catch (err) {
    next(err);
  }
};

/** @type {import('@types/express').RequestHandler} */
exports.deleteTodoByIdHandler = async ({ user, params: { todoId } }, res, next) => {
  try {
    const deletedTodo = await deleteTodoByIdAndUserId(
      todoId,
      user._id,
    );
    res.status(OK).json({ todo: deletedTodo });
  } catch (err) {
    next(err);
  }
};
