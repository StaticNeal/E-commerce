import express from 'express';
import { verifyPageAccess } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index', { title: 'Home' });
});

router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login' });
});


router.get('/update-profile', verifyPageAccess, (req, res) => {
    res.render('pages/updateUserdata', { title: 'Update Profile' });
});

router.get('/create-products', (req, res) => {
    res.render('pages/createproduct', { title: 'Create Product' });
});
export default router;
