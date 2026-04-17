import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: "HazardReport" | "Announcement";
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      required: true,
      enum: ["HazardReport", "Announcement"],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IComment>("Comment", commentSchema);
