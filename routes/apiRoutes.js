import express from 'express';
import { requestLoginOTP, verifyLoginOTP } from '../controllers/auth.js';
import { verifyToken, logout } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/request-otp - Request OTP for login
 */
router.post('/auth/request-otp', requestLoginOTP);

/**
 * POST /api/auth/verify-otp - Verify OTP and login
 */
router.post('/auth/verify-otp', verifyLoginOTP);

/**
 * POST /api/auth/logout - Logout user
 */
router.post('/auth/logout', logout);

/**
 * GET /api/auth/me - Get current user profile (protected)
 */
router.get('/auth/me', verifyToken, async (req, res) => {
    try {
        const userModel = (await import('../models/user.js')).default;
        const user = await userModel.findById(req.user.id).select('-otp -otpExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name || 'User'
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
});

/**
 * GET /api/protected - Protected route example
 */
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is a protected route',
        user: req.user
    });
});

export default router;
