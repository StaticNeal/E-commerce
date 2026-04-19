import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    otp: String,
    otpExpires: Date,
    lastOTPSentAt: Date,
    createdOn: {
        type: Date,
        default: Date.now,
    },
    lastLogin: Date,
    isVerified: {
        type: Boolean,
        default: false
    }
});

export default model('User', userSchema);

