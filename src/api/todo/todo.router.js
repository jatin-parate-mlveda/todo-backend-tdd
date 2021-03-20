const { Router } = require('express');
const authMiddleware = require('../../common/authMiddleware');
const { createTodoHandler } = require('./todo.controller');

const todoRouter = Router();

todoRouter.route('/')
  .post(
    authMiddleware,
    createTodoHandler,
  );

module.exports = todoRouter;
