const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const destRoutes = require('./routes/destination');
const aboutUsRoutes = require("./routes/aboutusRoute");
const enquiryRoutes = require("./routes/enquiryRoute");
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const PORT = process.env.PORT || 5000;

const app = express();
// Configure CORS for your frontend URL
app.use(cors({
  origin: 'https://tourvelsm123-7e9109f7a244.herokuapp.com',  // Allow your frontend's URL
  methods: 'GET,POST', // Allowed HTTP methods
  allowedHeaders: 'Content-Type, Authorization'  // Allowed headers
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
// Upload Middleware

const uploadsPath = path.join(__dirname, "uploads" , "images");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("Uploads directory created.");
}
// Serve static files from the 'uploads' folder
app.use("/uploads/images", express.static(uploadsPath));

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
app.use("/api/enquiries", enquiryRoutes);

// Default route to check API status
app.get('/', (req, res) => {
  res.send('API is running...');
});  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});