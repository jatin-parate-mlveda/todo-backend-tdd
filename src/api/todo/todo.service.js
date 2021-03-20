const Todo = require('./todo.model');

/** @param {import('./todo').TodoCreateData} todoDetails */
exports.createTodo = async (todoDetails) => await Todo.create(todoDetails);

/**
 * @param {import('mongoose').Types.ObjectId | string} todoId
 * @param {Pick<import('./todo').TodoCreateData, 'dueDate' | 'title'>} param1
 */
exports.updateTodo = async (
  todoId,
  docToUpdate = {},
) => await Todo.findByIdAndUpdate(todoId, docToUpdate, { new: true, runValidators: true });

exports.deleteTodo = () => {};

exports.deleteAllTodosOfUser = () => {

};
