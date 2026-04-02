import mongoose, { Schema } from 'mongoose';
import IHazardType from '../interfaces/hazardtypes';

const hazardTypeSchema: Schema = new Schema({
    name: { type: String, unique: true, required: true }
});

export default mongoose.model<IHazardType>('HazardType', hazardTypeSchema);
