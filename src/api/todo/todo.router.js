const { Router } = require('express');
const { body, param } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const authMiddleware = require('../../common/authMiddleware');
const { resStrings } = require('../../common/constants');
const noBodyToUpdateMiddleware = require('../../common/noBodyToUpdateMiddleware');
const validateReq = require('../../common/validateReq');
const {
  createTodoHandler,
  getAllTodosHandler,
  updateTodoByIdHandler,
  deleteTodoByIdHandler,
} = require('./todo.controller');

const todoRouter = Router();

const todoIdParamValidator = param('todoId')
  .custom((value) => {
    if (isValidObjectId(value)) {
      return true;
    }
    throw resStrings.todo.invalidTodoId;
  });

todoRouter.use(authMiddleware);

todoRouter.route('/')
  .post(createTodoHandler)
  .get(getAllTodosHandler);

todoRouter.route('/:todoId')
  .put(
    [
      noBodyToUpdateMiddleware,
      body('user')
        .not()
        .exists()
        .withMessage(resStrings.todo.userInBodyToUpdate),
      todoIdParamValidator,
    ],
    validateReq,
    updateTodoByIdHandler,
  )
  .delete(
    todoIdParamValidator,
    validateReq,
    deleteTodoByIdHandler,
  );

module.exports = todoRouter;
