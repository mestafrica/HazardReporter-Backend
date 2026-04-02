import { Schema, Types, model } from "mongoose";




const resetTokenSchema = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    expired: { type: Boolean, default: false },
    expiresAt: {
        type: Date,
        default: () => new Date().setHours(new Date().getHours() + 2)
    }
}, {
    timestamps: true
});


export const ResetTokenModel = model('ResetToken', resetTokenSchema);