const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String, // You can also use Number for price if needed
    required: true,
  },
  duration: {
    type: String, // Optional: Duration of the package (e.g., "5 days, 4 nights")
    required: false,
  },
  inclusions: {
    type: [String], // List of inclusions for the package (e.g., "Flight", "Hotel")
    required: false,
  },
});

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false, // Optional field
  },
  bestTime: {
    type: String,
    required: false, // Optional field
  },
  activities: {
    type: [String], // Array of strings for multiple activities
    required: false, // Optional field
  },
  packages: {
    type: [packageSchema], // Array of packages for the destination
    required: false, // Optional field
  },
});

const Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;
