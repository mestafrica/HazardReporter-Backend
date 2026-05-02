import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/notification";

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["report", "announcement", "user", "system"],
      default: "system",
      index: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false, index: true },
    entityType: {
      type: String,
      enum: ["hazardReport", "announcement", "user", "system"],
    },
    entityId: { type: Schema.Types.ObjectId, index: true },
    link: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
