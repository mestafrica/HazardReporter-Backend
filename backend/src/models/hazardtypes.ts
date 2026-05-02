import mongoose, { Schema, Document } from 'mongoose';

export interface IHazardType extends Document {
    name: string;
}

const hazardTypeSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

export default mongoose.model<IHazardType>('HazardType', hazardTypeSchema);
