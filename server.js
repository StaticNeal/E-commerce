//module imports
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestLoginOTP, verifyLoginOTP } from './controllers/auth.js';
import { verifyToken, logout } from './middleware/auth.js';
import { connectDB } from './utils/dbConnection.js';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up views engine and path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('pages/index', { title: 'Home' });
});

app.get('/login', (req, res) => {
    res.render('pages/login', { title: 'Login' });
});

// API Routes
app.post('/api/auth/request-otp', requestLoginOTP);
app.post('/api/auth/verify-otp', verifyLoginOTP);
app.post('/api/auth/logout', logout);

// Get current user profile
app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        const userModel = (await import('./models/user.js')).default;
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

// Protected route example - use verifyToken middleware
app.get('/api/protected', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'This is a protected route',
        user: req.user
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start listening
        app.listen(PORT, () => {
            console.log(`✓ Server running: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();