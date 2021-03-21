const Todo = require('./todo.model');

/** @param {import('mongoose').Types.ObjectId | string} userId */
exports.getAllByUserId = async (userId) => await Todo.find({ user: userId });

/** @param {import('./todo').TodoCreateData} todoDetails */
exports.createTodo = async (todoDetails) => await Todo.create(todoDetails);

/**
 * @param {import('mongoose').Types.ObjectId | string} todoId
 * @param {import('mongoose').Types.ObjectId | string} userId
 * @param {Pick<import('./todo').TodoCreateData, 'dueDate' | 'title'>} param1
 */
exports.updateTodoByIdAndUser = async (
  todoId,
  userId,
  docToUpdate = {},
) => await Todo.findOneAndUpdate(
  {
    _id: todoId,
    user: userId,
  },
  docToUpdate,
  { new: true, runValidators: true },
);

/** @param {import('mongoose').Types.ObjectId | string} id */
exports.deleteTodoByIdAndUserId = async (id, userId) => await Todo.findOneAndDelete({
  _id: id,
  user: userId,
});
