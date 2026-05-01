import express from 'express';
import { verifyPageAccess } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    
    if (/mobile|android|iphone/i.test(userAgent)) {
        
        res.render('pages/mobile/index', { title: 'Home' });  
    } else {
        
        res.render('pages/desktop/index', { title: 'Home' });
    }
});

router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login' });
});


router.get('/update-profile', verifyPageAccess, (req, res) => {
    res.render('pages/updateUserdata', { title: 'Update Profile' });
});

router.get('/create-product', (req, res) => {
    const userAgent = req.headers['user-agent'];
    
    if (/mobile|android|iphone/i.test(userAgent)) {
        
        res.render('pages/mobile/createproduct', { title: 'Create-product' });  
    } else {
        
        res.render('pages/desktop/createproduct', { title: 'Create-product' });
    }
});
export default router;
