import { Document, Types } from "mongoose";

export type NotificationType = "report" | "announcement" | "user" | "system";
export type NotificationEntityType =
  | "hazardReport"
  | "announcement"
  | "user"
  | "system";

export interface INotification extends Document {
  _id: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  entityType?: NotificationEntityType;
  entityId?: Types.ObjectId;
  link?: string;
  metadata?: Record<string, unknown>;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
