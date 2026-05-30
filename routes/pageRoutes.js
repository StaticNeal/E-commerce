import express from 'express';
import { verifyPageAccess } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];

    if (/mobile|android|iphone/i.test(userAgent)) {

        res.render('pages/mobile/index', { title: 'Home', currentPage: 'home' });
    } else {

        res.render('pages/desktop/index', { title: 'Home', currentPage: 'home' });
    }
});

router.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login', currentPage: 'login' });
});


router.get('/update-profile', verifyPageAccess, (req, res) => {
    res.render('pages/updateUserdata', { title: 'Update Profile', currentPage: 'update-profile' });
});

router.get('/create-product', (req, res) => {
    const userAgent = req.headers['user-agent'];

    if (/mobile|android|iphone/i.test(userAgent)) {

        res.render('pages/mobile/createproduct', { title: 'Create-product', currentPage: 'create-product' });
    } else {

        res.render('pages/desktop/createproduct', { title: 'Create-product', currentPage: 'create-product' });
    }
});

router.get('/manage-products', (req, res) => {
    const userAgent = req.headers['user-agent'];

    if (/mobile|android|iphone/i.test(userAgent)) {

        res.render('pages/mobile/manageproducts', { title: 'Manage Products', currentPage: 'manage-products' });
    } else {

        res.render('pages/desktop/manageproducts', { title: 'Manage Products', currentPage: 'manage-products' });
    }
});


router.get('/product/:id', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const { id } = req.params;

    if (/mobile|android|iphone/i.test(userAgent)) {
        res.render('pages/mobile/product', { title: 'Product', productId: id, currentPage: 'product' });
    } else {
        res.render('pages/desktop/product', { title: 'Product', productId: id, currentPage: 'product' });
    }
});

export default router;
