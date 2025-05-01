const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const { body, validationResult } = require('express-validator');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting setup
const rateLimiter = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: 'middleware',
  points: 10, // Number of points
  duration: 1, // Per second
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    res.status(429).json({ message: 'Too Many Requests' });
  }
});

// Input validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes with validation
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  autoIndex: true // Enable indexing
})
.then(() => {
  console.log('MongoDB Connected ✅');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} 🚀`);
  });
})
.catch((err) => console.error('MongoDB Connection Error:', err));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  mongoose.connection.close();
  process.exit(0);
});