import { Model, Schema, Document, Types } from 'mongoose';
import { UserDocument } from '../user/user.d';

declare enum PriorityLevel {
  High = 1,
  Medium = 2,
  Low = 2,
}

type TodoCreateData = {
  user: Types.ObjectId | UserDocument;
  title: string;
  dueDate?: Date;
  priority: PriorityLevel;
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
