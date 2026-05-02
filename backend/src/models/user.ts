import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user";

const UserSchema: Schema = new Schema(
  {
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    role: { type: String, default: "user", enum: ["admin", "user"] },
    avatar: { type: String, default: "" },
    reports: [{ type: Schema.Types.ObjectId, ref: "Reports" }],
    createResetPasswordToken: { type: String },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpires: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Apply plugins
// resetTokenSchema
//     // .plugin(mongooseErrors)
//     .plugin(toJSON);

// Export Models
export default mongoose.model<IUser>("User", UserSchema);

// //create an instance method
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     const hash = await bcrypt.hash("password", Number(bcryptSalt));
//     this.password = hash;
//     next();
// });

// UserSchema.createResetPasswordToken = function(){
//     const resetToken =  crypto.randomBytes(32).toString();

//     this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
//     this.passwordResetTokenExpires = Date.now() * 10 * 60 * 1000;

//     console.log(resetToken, this.passwordResetToken)

//     return resetToken;
// }
