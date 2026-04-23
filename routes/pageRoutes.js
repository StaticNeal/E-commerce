import express from 'express';
import { verifyPageAccess } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET / - Home page
 */
router.get('/', (req, res) => {
    res.render('pages/index', { title: 'Home' });
});

/**
 * GET /login - Login page
 */
router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login' });
});

/**
 * GET /update-profile - Update profile page (Protected - Login required)
 */
router.get('/update-profile', verifyPageAccess, (req, res) => {
    res.render('pages/updateUserdata', { title: 'Update Profile' });
});

export default router;
