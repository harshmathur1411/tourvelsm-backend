const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const destRoutes = require('./routes/destination');
const aboutUsRoutes = require("./routes/aboutusRoute");
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const PORT = process.env.PORT || 5000;

const app = express();
// Configure CORS for your frontend URL
app.use(cors({
  origin: ['http://localhost:3000', 'https://tourvelsm-frontend.herokuapp.com'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SECRET_TOKEN_ACCESS || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      httpOnly: true,
      maxAge: 3600000, 
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/destination', destRoutes);
app.use("/api/about-us", aboutUsRoutes);

// Default route to check API status
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});