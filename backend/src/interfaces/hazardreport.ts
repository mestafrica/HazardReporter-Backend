import { Document, Types } from "mongoose";

export interface IHazardReport extends Document {
    title: String;
    hazardtype: String;
    description: String;
    images: String[];
    location: String;
    city: String;
    country: String;
    user: Types.ObjectId;
    upvotes: number;
    upvotedBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
