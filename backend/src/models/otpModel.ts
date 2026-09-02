import mongoose from "mongoose";


export interface IOTP extends Document {
    email: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
}

const otpSchema = new mongoose.Schema<IOTP>(
    {
        email: { type: String, required: true },
        otp: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

const otpModel = mongoose.model<IOTP>("OTP", otpSchema);

export default otpModel;
