
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authRoutes = require('../tourvelsm-backend/routes/auth');
const destRoutes = require('../tourvelsm-backend/routes/destination');
const aboutUsRoutes = require("../tourvelsm-backend/routes/aboutusRoute");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const fs = require('fs'); // Import fs for checking file existence
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON
app.use(express.json());

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

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));


app.use('/api/auth', authRoutes);
app.use('/api/destination', destRoutes);
app.use("/api/about-us", aboutUsRoutes);

// Debugging NODE_ENV
console.log(`Environment: ${process.env.NODE_ENV}`);
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  // const frontendBuildPath = path.join(__dirname, '../tourvelsm-frontend/build');
  app.use(express.static( path.join(__dirname, '../tourvelsm-frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../tourvelsm-frontend/build', 'index.html'));
  });

} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});

  