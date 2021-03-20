const { Schema, model, Types } = require('mongoose');
const {
  userModelName,
  todoModelName,
  resStrings: { todo: resStrings },
} = require('../../common/constants');

/** @type {import('./todo').TodoSchema} */
const todoSchema = new Schema(
  {
    dueDate: {
      type: Date,
      required: false,
    },
    title: {
      type: String,
      required: [true, resStrings.noTitle],
    },
    user: {
      type: Types.ObjectId,
      ref: userModelName,
      required: [true, resStrings.noUser],
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const Todo = model(todoModelName, todoSchema);

module.exports = Todo;
