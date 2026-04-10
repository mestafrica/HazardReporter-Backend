import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    title: string;
    detail: string;
    category: 'Alert' | 'Info' | 'Update';
    status: 'Pinned' | 'Active' | 'Archived';
    pinToFeed: boolean;
    location?: {
        text: string;
        city?: string;
        country?: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    attachments?: {
        _id?: mongoose.Types.ObjectId;
        url: string;
        filename: string;
        publicId: string;
        format: string;
    }[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const announcementSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    detail: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Alert', 'Info', 'Update'], 
        default: 'Info' 
    },
    status: { 
        type: String, 
        enum: ['Pinned', 'Active', 'Archived'], 
        default: 'Active' 
    },
    pinToFeed: { type: Boolean, default: false },
    location: {
        text: { type: String },
        city: { type: String },
        country: { type: String },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    attachments: [{
        _id: { type: Schema.Types.ObjectId, auto: true },
        url: { type: String, required: true },
        filename: { type: String, required: true },
        publicId: { type: String, required: true },
        format: { type: String }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

announcementSchema.index({ status: 1, createdAt: -1 });
announcementSchema.index({ category: 1 });

export default mongoose.model<IAnnouncement>('Announcement', announcementSchema);
