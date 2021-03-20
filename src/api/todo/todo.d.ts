import { Model, Schema, Document, Types, Types } from 'mongoose';
import { UserDocument } from '../user/user.d';

type TodoCreateData = {
  user: Types.ObjectId | UserDocument;
  title: string;
  dueDate?: Date;
}

type Todo = TodoCreateData & {
  createdAt: Date;
  updatedAt: Date;
}

interface TodoDocument extends Todo, Document<Types.ObjectId> {
  createdAt: Date;
  updatedAt: Date;
  constructor(doc: TodoCreateData): this;
}

interface TodoModel extends Model<TodoDocument> {
  new(doc?: TodoCreateData): TodoDocument;
}

interface TodoSchema extends Schema<TodoDocument, TodoModel, Todo> { }
