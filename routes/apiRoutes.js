import express from 'express';
import { requestLoginOTP, verifyLoginOTP, updateUsername } from '../controllers/auth.js';
import { verifyToken, logout } from '../middleware/auth.js';

const router = express.Router();

router.post('/auth/request-otp', requestLoginOTP);
router.post('/auth/verify-otp', verifyLoginOTP);
router.post('/auth/logout', verifyToken, logout);
router.post('/auth/update-username', verifyToken, updateUsername);


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
                name: user.name || 'User',
                username: user.username || null
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


router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is a protected route',
        user: req.user
    });
});

export default router;
