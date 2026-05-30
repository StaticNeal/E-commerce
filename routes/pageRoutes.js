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

router.get('/manage-products', (req, res) => {
    const userAgent = req.headers['user-agent'];

    if (/mobile|android|iphone/i.test(userAgent)) {

        res.render('pages/mobile/manageproducts', { title: 'Manage Products' });
    } else {

        res.render('pages/desktop/manageproducts', { title: 'Manage Products' });
    }
});


router.get('/product/:id', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const { id } = req.params;

    if (/mobile|android|iphone/i.test(userAgent)) {
        res.render('pages/mobile/product', { title: 'Product', productId: id });
    } else {
        res.render('pages/desktop/product', { title: 'Product', productId: id });
    }
});

export default router;
