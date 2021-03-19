const { Router } = require('express');
const userRouter = require('./user/user.router');

const apiRouter = Router();

apiRouter.use('/user', userRouter);

module.exports = apiRouter;
