import userModel from '../models/user.js';
import { SendVerificationCode, WelcomeEmail } from '../middleware/Email.js';
import { isValidEmail } from '../utils/validators.js';
import { generateOTP, getOTPExpiry, generateJWT, getCookieOptions } from '../utils/helpers.js';

export const requestLoginOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Find existing user by email (regardless of verification status)
        let user = await userModel.findOne({ email: normalizedEmail });

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry(10);

        if (!user) {
            // Create new user only if email doesn't exist
            user = new userModel({
                email: normalizedEmail,
                otp: otp,
                otpExpires: otpExpiry
            });
        } else {
            // Allow verified users to login again - update OTP for both new and verified users
            user.otp = otp;
            user.otpExpires = otpExpiry;
        }

        await user.save();

        await SendVerificationCode(user.email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            isNewUser: !user.isVerified
        });

    } catch (error) {
        console.error('Request OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during OTP request'
        });
    }
};


export const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase(),
            otp: otp,
            otpExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.lastLogin = new Date();
        await user.save();

        const token = generateJWT({ id: user._id, email: user.email }, '7d');

        res.cookie('token', token, getCookieOptions(7));

        await WelcomeEmail(user.email, user.name || 'User');

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name || 'User'
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login verification'
        });
    }
};

export const updateUsername = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const validEmail = email.toLowerCase();
        const user = await userModel.findOne({ email: validEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.username = username;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Username updated successfully'
        });

    } catch (error) {
        console.error('Update Username error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during username update'
        });
    }
}