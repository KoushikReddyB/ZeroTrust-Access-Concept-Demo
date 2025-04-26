const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
})
.catch((err) => console.error('MongoDB Connection Error:', err));
