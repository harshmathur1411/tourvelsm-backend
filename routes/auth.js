const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');


const User = require('../models/user'); // Adjust the path as needed
const Contact = require('../models/contact');
const Destination = require("../models/destination");

const router = express.Router();



// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN_ACCESS);
    req.user = verified; // Attach the verified user data to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Please sign up first" });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Exclude the password from the response
    const { password, ...others } = user.toObject();

    // Generate the JWT token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_TOKEN_ACCESS,
      { expiresIn: "1h" }
    );

    // Respond with user data and token
    res.status(200).json({
      message: `Login successful! Welcome, ${user.username}.`,
      user: others,
      accessToken: accessToken,
    });
    req.session.userId = user._id;
    console.log( req.session.userId ,'user with id');
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Sign-in failed", error: error.message });
  }
});

// Get user details (protected route)
router.get('/', async (req, res) => {
  req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session._id);
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user details (protected route)
router.put('/:id', verifyToken, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user details
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a user (protected route)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Contact

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message received and saved!' });
  } catch (error) {
    console.error('Error saving contact:', error);

    // Send appropriate error response
    res.status(500).json({
      message: 'Failed to process the message.',
      error: error.message, // Optional: include detailed error for debugging
    });
  }
});

// Blog

const blogs = [
  {
    _id: "1",
    title: "Top 10 Travel Destinations in 2025",
    content: "Discover the best travel destinations to visit in 2025...",
    image: "https://via.placeholder.com/300x150",
  },
  {
    _id: "2",
    title: "Travel Tips for Budget Travelers",
    content: "Save money on your next trip with these simple tips...",
    image: "https://via.placeholder.com/300x150",
  },
  {
    _id: "3",
    title: "The Ultimate Guide to Packing Light",
    content: "Learn how to pack efficiently for any trip...",
    image: "../../tourvelsm-frontend/src/assets/Images/Kerala.jpg",
  },
];

// Route to get all blogs
router.get("/blogs", (req, res) => {
  res.json(blogs);
});
// Get rating

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Rating.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});


// Forgot Password


router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "An error occurred", error });
  }
});

module.exports = router;


module.exports = router;
