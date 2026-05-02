import mongoose, { Schema } from 'mongoose';
import { IHazardReport } from '../interfaces/hazardreport';

const hazardReportSchema: Schema = new Schema({
    title: { type: String, required: true },
    hazardtype: { type: String, required: true, index: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    location: { type: String, required: true },
    city: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    latitude: { type: Number, index: true },
    longitude: { type: Number, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, default: 'pending', index: true },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date,
    moderationNote: String,
    upvotes: { type: Number, default: 0, index: true },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: Date,
    updatedAt: Date,
}, {
    timestamps: true
});

// Compound index for efficient sorting and filtering
hazardReportSchema.index({ createdAt: -1 });
hazardReportSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IHazardReport>('HazardReport', hazardReportSchema);