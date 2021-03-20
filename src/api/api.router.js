const { Router } = require('express');
const todoRouter = require('./todo/todo.router');
const userRouter = require('./user/user.router');

const apiRouter = Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/todo', todoRouter);

module.exports = apiRouter;
