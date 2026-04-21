import mongoose from "mongoose";
import { IComment } from "../interfaces/comment"; // 👈 imported from interfaces folder

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
            refPath: 'targetType',
        },
        targetType: {
            type: String,
            required: true,
            enum: ['HazardReport'], 
            default: 'HazardReport',
        },
    },
    { timestamps: true },
);

export default mongoose.model<IComment>("Comment", commentSchema);