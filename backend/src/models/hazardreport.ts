import mongoose, { Schema } from 'mongoose';
import { IHazardReport } from '../interfaces/hazardreport';

const hazardReportSchema: Schema = new Schema({
    title:       { type: String, required: true },
    hazardtype:  { type: String, required: true },
    description: { type: String, required: true },
    images:      { type: [String], required: true },
    location:    { type: String, required: true },
    city:        { type: String, required: true },
    country:     { type: String, required: true },
    user:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'investigating', 'resolved', 'spam'],
        default: 'pending'
    },
    upvotes:    { type: Number, default: 0 },
    upvotedBy:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
    moderatedBy:  { type: Schema.Types.ObjectId, ref: 'User', default: null }, 
    moderatedAt:  { type: Date, default: null }, 
    moderationNote: { type: String, default: null },
}, {
    timestamps: true
});

export default mongoose.model<IHazardReport>('HazardReport', hazardReportSchema);