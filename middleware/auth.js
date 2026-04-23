import { verifyJWT, getCookieOptions } from '../utils/helpers.js';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login.'
            });
        }

        const decoded = verifyJWT(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token verification error. Please login again.'
        });
    }
};

export const verifyPageAccess = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }

        const decoded = verifyJWT(token);
        
        if (!decoded) {
            return res.redirect('/login');
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('token', getCookieOptions());

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};
