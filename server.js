
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require("cors");
// const jwt = require('jsonwebtoken');
// const session = require('express-session');
// const authRoutes = require('routes/auth');
// const destRoutes = require('routes/destination');
// const aboutUsRoutes = require("routes/aboutusRoute");
// const path = require('path');
// // require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// require('dotenv').config();
// const fs = require('fs'); // Import fs for checking file existence
// const PORT = process.env.PORT || 5000;

// const app = express();
// app.use(cors());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Middleware to parse JSON
// app.use(express.json());

// app.use(
//     session({
//       secret: process.env.SECRET_TOKEN_ACCESS || 'fallback-secret',
//       resave: false,
//       saveUninitialized: false,
//       cookie: { 
//         httpOnly: true,
//         maxAge: 3600000, 
//         secure: process.env.NODE_ENV === 'production',
//       },
//     })
// );

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));


// app.use('/api/auth', authRoutes);
// app.use('/api/destination', destRoutes);
// app.use("/api/about-us", aboutUsRoutes);

// // Debugging NODE_ENV
// console.log(`Environment: ${process.env.NODE_ENV}`);
// __dirname = path.resolve();
// if (process.env.NODE_ENV === 'production') {
//   // const frontendBuildPath = path.join(__dirname, '../tourvelsm-frontend/build');
//   app.use(express.static( path.join(__dirname, '../tourvelsm-frontend/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../tourvelsm-frontend/build', 'index.html'));
//   });

// } else {
//   app.get('/', (req, res) => {
//     res.send('API is running...');
//   });
// }
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);  
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const destRoutes = require('./routes/destination');
const aboutUsRoutes = require("./routes/aboutusRoute");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load .env file in backend folder
const fs = require('fs');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: ['http://localhost:5000', 'https://tourvelsm123-7e9109f7a244.herokuapp.com'], // Add your frontend URLs
  credentials: true,
}));


// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve favicon if it exists in the public folder (and handle missing favicon gracefully)
app.use(express.static(path.join(__dirname, 'public')));

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
}).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/destination', destRoutes);
app.use("/api/about-us", aboutUsRoutes);

// Handle favicon.ico request more gracefully to avoid crashes
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
  console.log('Favicon requested:', faviconPath); // Debugging the request
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath); // Serve the favicon if it exists
  } else {
    console.log('Favicon not found, returning 204');
    res.status(204).send(); // No content if favicon is missing
  }
});

// Debugging NODE_ENV
console.log(`Environment: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'production') {
  // In production, redirect to frontend
  app.get('*', (req, res) => {
    res.redirect('https://tourvelsm123-7e9109f7a244.herokuapp.com/');
  });

} else {
  // In development, show API status
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});
