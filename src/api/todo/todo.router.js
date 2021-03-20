const { Router } = require('express');
const authMiddleware = require('../../common/authMiddleware');

const todoRouter = Router();

todoRouter.route('/')
  .post();

todoRouter.route('/:id')
  .get()
  .delete();

module.exports = todoRouter;
