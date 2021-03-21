const { Router } = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../../common/authMiddleware');
const { resStrings } = require('../../common/constants');
const noBodyToUpdateMiddleware = require('../../common/noBodyToUpdateMiddleware');
const validateReq = require('../../common/validateReq');

const {
  loginHandler, registerHandler, duplicateEmailErrorHandler, updateUserHandler, deleteUserHandler,
} = require('./user.controller');

const userRouter = Router();

userRouter.post(
  '/login',
  [
    body('password')
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage(resStrings.user.noPassword)
      .isLength({ min: 6 })
      .withMessage(resStrings.user.minPasswordLen),
  ],
  validateReq,
  loginHandler,
);

userRouter.post(
  '/register',
  [
    body('password')
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage(resStrings.user.noPassword)
      .isLength({ min: 6 })
      .withMessage(resStrings.user.minPasswordLen),
  ],
  validateReq,
  registerHandler,
  duplicateEmailErrorHandler,
);

userRouter.route('/')
  .put(
    authMiddleware,
    [
      noBodyToUpdateMiddleware,
      body('password')
        .optional({ nullable: false })
        .exists({ checkNull: true })
        .withMessage(resStrings.user.noPassword),
      body('email')
        .not().exists().withMessage(resStrings.user.cantUpdateEmail),
    ],
    validateReq,
    updateUserHandler,
  )
  .delete(
    authMiddleware,
    deleteUserHandler,
  );

module.exports = userRouter;
