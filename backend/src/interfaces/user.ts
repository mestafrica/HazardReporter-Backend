import { Document, Types } from "mongoose";

export default interface IUser extends Document {
  _id: Types.ObjectId;
  userName: string;
  email?: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "user";
  avatar?: string;
  reports: Types.ObjectId[];
  createResetPasswordToken?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
}

export interface IReport extends Document {
  userId: Types.ObjectId;
  reportType: string;
  description: string;
  status: string;
  createdAt: Date;
}
