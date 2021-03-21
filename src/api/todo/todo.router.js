const { Router } = require('express');
const { body, param } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const authMiddleware = require('../../common/authMiddleware');
const { resStrings } = require('../../common/constants');
const validateReq = require('../../common/validateReq');
const {
  createTodoHandler,
  getAllTodosHandler,
  updateTodoByIdHandler,
} = require('./todo.controller');

const todoRouter = Router();

todoRouter.route('/')
  .post(
    authMiddleware,
    createTodoHandler,
  )
  .get(
    authMiddleware,
    getAllTodosHandler,
  );

todoRouter.route('/:todoId')
  .put(
    authMiddleware,
    [
      body('user')
        .not()
        .exists()
        .withMessage(resStrings.todo.userInBodyToUpdate),
      param('todoId')
        .custom((value) => {
          if (isValidObjectId(value)) {
            return true;
          }
          throw resStrings.todo.invalidTodoId;
        }),
    ],
    validateReq,
    updateTodoByIdHandler,
  );

module.exports = todoRouter;
