const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDatabase } = require('./models/database');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const topicRoutes = require('./routes/topics');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts to 5 per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const pageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit page requests to 60 per minute (generous for normal browsing)
  message: 'Too many page requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database
initDatabase();

// API Routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', apiLimiter, categoryRoutes);
app.use('/api/topics', apiLimiter, topicRoutes);
app.use('/api/posts', apiLimiter, postRoutes);

// Serve frontend with rate limiting
app.get('/', pageLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/category/:id', pageLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/category.html'));
});

app.get('/topic/:id', pageLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/topic.html'));
});

app.get('/login', pageLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', pageLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Forum server running on http://localhost:${PORT}`);
});

module.exports = app;
