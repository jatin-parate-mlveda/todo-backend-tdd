const { CREATED, OK, CONFLICT } = require('http-codes');
const ApiError = require('../../common/apiError');
const hashPassword = require('../../common/hashPassword');
const { resStrings } = require('../../common/constants');
const { getUserByEmail, createUser, updateUserById } = require('./user.service');
const { sign } = require('../../common/jwt');

/**
 * @type {import('@types/express').RequestHandler<
 *  {},
 *  {},
 *  import('./user').UserCreateData,
 *  {},
 *  {}
 * >}
 */
exports.registerHandler = async (
  {
    body: {
      email, name, password, avatar,
    },
  },
  res,
  next,
) => {
  try {
    const createdUser = await createUser({
      email, name, password, avatar,
    });
    const userDetails = createdUser.toJSON();
    delete userDetails.password;
    res.status(CREATED).json({ user: userDetails });
  } catch (error) {
    next(error);
  }
};

/**
 * @type {import('@types/express').RequestHandler<
 *  {},
 *  {},
 *  Exclude<Partial<import('./user').User>, email>,
 *  {},
 *  {}
 * >}
 */
exports.updateUserHandler = async ({ body, user: { _id } }, res, next) => {
  try {
    const { password, _id: userId, ...userDetails } = (
      await updateUserById(_id, body)
    ).toJSON();
    res.status(OK).json({
      user: {
        ...userDetails,
        _id: userId.toHexString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @type {import('@types/express').RequestHandler<
 *  {},
 *  {},
 *  {email: string, password: string},
 *  {},
 *  {}
 * >}
 */
exports.loginHandler = async (req, res, next) => {
  try {
    const userInDb = await getUserByEmail(req.body.email);
    if (!userInDb) {
      throw ApiError.notFound(resStrings.user.notFound);
    }

    const hashedPassword = await hashPassword(req.body.password);
    if (hashedPassword !== userInDb.password) {
      throw ApiError.unAuthorized(resStrings.user.invalidPassword);
    }

    const {
      password,
      _id,
      ...userDetails
    } = userInDb.toJSON();
    res.cookie('token', await sign({ ...userDetails, _id: _id.toHexString() }));
    res
      .status(OK)
      .json({
        user: userDetails,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @type {import('@types/express').RequestHandler<
 *  {},
 *  {},
 *  {email: string, password: string},
 *  {},
 *  {}
 * >}
 */
exports.deleteUserHandler = async ({ user }, res, next) => {
  try {
    /** @type {import('./user').UserDocument} */
    const deletedUser = await user.remove();
    const { password, ...userDetails } = deletedUser.toJSON();
    res
      .status(OK)
      .json({ user: userDetails });
  } catch (error) {
    next(error);
  }
};

/**
 * @type {import('@types/express').ErrorRequestHandler}
 */
exports.duplicateEmailErrorHandler = async (reqError, req, res, next) => {
  try {
    if (
      reqError instanceof Error
      && reqError.name === 'MongoError'
      && reqError.code === 11000
    ) {
      next(new ApiError(CONFLICT, resStrings.user.alreadyExists));
    } else {
      next(reqError);
    }
  } catch (error) {
    next(error);
  }
};
