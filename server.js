//module imports
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestLoginOTP, verifyLoginOTP } from './controllers/auth.js';
import { connectDB } from './utils/dbConnection.js';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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