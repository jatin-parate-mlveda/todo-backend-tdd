import { Model, Schema, Document, Types } from 'mongoose';

type UserCreateData = {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

type User = {
    name: string;
    email: string;
    password: string;
    avatar: string;
};

interface UserDocument extends User, Document<Types.ObjectId> {
    constructor(doc?: User): this;
}

interface UserModel extends Model<UserDocument> {
    new(doc?: User): UserDocument;
}

interface UserSchema extends Schema<UserDocument, UserModel, User> { }

