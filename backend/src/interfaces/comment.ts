import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
    content: string;
    userId: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId;
    targetType: 'HazardReport';
    createdAt: Date;
    updatedAt: Date;
}