import mongoose, { Schema, Document } from "mongoose";
import IUser from "../interfaces/user"; // Import IUser interface

// Define schema for authentication
const AuthenticationSchema = new Schema({
  password: { type: String, required: true, select: false },
  salt: { type: String, select: false },
  sessionToken: { type: String, select: false },
});

// Define schema
const UserSchema: Schema<IUser> = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String },
});

// Create model only if it doesn't already exist
const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

// Function to get all users
export const getUser = () => UserModel.find().exec();

// Function to get a user by email
export const getUserByEmail = (email: string) =>
  UserModel.findOne({ email }).exec();

// Function to get a user by session token
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken }).exec();

// Function to get a user by ID
export const getUserById = (id: string) => UserModel.findById(id).exec();

// Function to create a new user
export const createUser = (values: Record<string, any>): Promise<IUser> =>
  new UserModel(values).save();

// Function to delete a user by ID
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete(id).exec();

// Function to update a user by ID
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true }).exec();
