import express from 'express';

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
 * GET /update-profile - Update profile page
 */
router.get('/update-profile', (req, res) => {
    res.render('pages/updateUserdata', { title: 'Update Profile' });
});

export default router;
