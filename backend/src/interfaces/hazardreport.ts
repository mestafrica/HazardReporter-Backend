import { Document, Types } from "mongoose";

export interface IHazardReport extends Document {
    title: string;
    hazardtype: string;
    description: string;
    images: string[];
    location: string;
    city: string;
    country: string;
    user: Types.ObjectId;
    status: 'pending' | 'confirmed' | 'investigating' | 'resolved' | 'spam';
    upvotes: number;
    upvotedBy: Types.ObjectId[];
    moderatedBy: Types.ObjectId | null;
    moderatedAt: Date | null;
    moderationNote: string | null;
    createdAt: Date;
    updatedAt: Date;
}