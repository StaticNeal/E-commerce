import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import { SendVerificationCode, WelcomeEmail } from '../middleware/Email.js';


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

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

        
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        
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