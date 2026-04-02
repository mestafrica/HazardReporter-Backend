import { Document, Types } from "mongoose";

export interface IHazardReport extends Document {
    title: string;
    hazardtype: string;
    description: string;
    images: string[];
    longitude: string;
    latitude: string;
    city: string;
    country: string;
    user: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
