import jwt from 'jsonwebtoken';

/**
 * Generate a random OTP code
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} - Generated OTP
 */
export const generateOTP = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

/**
 * Calculate OTP expiry time
 * @param {number} minutes - Minutes from now (default: 10)
 * @returns {Date} - Expiry datetime
 */
export const getOTPExpiry = (minutes = 10) => {
    return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Generate JWT token
 * @param {object} payload - Data to encode in token
 * @param {string} expiresIn - Expiration time (default: 7d)
 * @returns {string} - Generated JWT token
 */
export const generateJWT = (payload, expiresIn = '7d') => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn }
    );
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {object|null} - Decoded token or null if invalid
 */
export const verifyJWT = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
        return null;
    }
};

/**
 * Generate cookie options for JWT
 * @param {number} days - Days until expiry (default: 7)
 * @returns {object} - Cookie options
 */
export const getCookieOptions = (days = 7) => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: days * 24 * 60 * 60 * 1000
    };
};
