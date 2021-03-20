exports.resStrings = {
  pageNotFound: 'Page not found!',
  unAuthorized: 'Unauthorized access!',
  internalServer: 'Internal Server Error!',
  unProcessableEntity: 'UnProcessable Entity!',
  todo: {
    noDueDate: 'Due Date is required',
    noTitle: 'Title is required',
    noUser: 'Associated user is required',
  },
  user: {
    noBodyToUpdate: 'At least one parameter is required to update',
    alreadyExists: 'User already exists!',
    notFound: 'Requested user not found!',
    invalidPassword: 'Invalid Password!',
    noPassword: 'No password provided!',
    invalidEmail: 'Invalid Email Id',
    noEmail: 'Email id is required!',
    minPasswordLen: 'Password must be of min length 6',
    invalidAvatar: 'Invalid avatar url',
    noName: 'Name is required!',
    noAvatar: 'Avatar is required!',
  },
};

// envs
exports.jwtSecret = process.env.JWT_SECRET;
exports.saltSecret = process.env.SALT;
exports.dbUrl = process.env.DB_URL;
exports.port = parseInt(process.env.PORT || 3000, 10);

// model names
exports.userModelName = 'users';
exports.todoModelName = 'todos';
