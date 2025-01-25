const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
    required: true,
  },
  values: {
    type: [String], // Array of strings for core values
    required: true,
  },
  image: {
    type: String, // Path to an image
    required: false,
  },
});

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
