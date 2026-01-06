import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;

// In-memory storage for users
const users = [];

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Add user info to request
        next();
    });
};

// POST /api/register - User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists (duplicate email)
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before storing (security best practice)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Store user data (in-memory array)
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword
        };
        users.push(newUser);

        // Return success message with user info (don't return the password!)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/login - User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password matches the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate authentication token (expires in 24 hours)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return token and user information (without password)
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/profile - Protected Route (requires authentication)
app.get('/api/profile', authenticateToken, (req, res) => {
    try {
        // Find the logged-in user's profile information
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user's profile (without password)
        res.status(200).json({
            message: 'Profile retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/public - Public Route (accessible without authentication)
app.get('/api/public', (req, res) => {
    res.status(200).json({ message: 'This is a public route' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});