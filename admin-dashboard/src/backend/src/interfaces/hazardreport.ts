import { Document, Types } from "mongoose";

export interface IHazardReport extends Document {
    title: String;
    hazardtype: String;
    description: String;
    images: String[];
    longitude: String;
    latitude: String;
    city: String;
    country: String;
    user: Types.ObjectId;
}
