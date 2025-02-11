const express = require("express");
const router = express.Router();
const Enquiry = require("../models/enquiry");

// Create an enquiry
router.post("/", async (req, res) => {
    try {
      const { name, email, phone, message, placeId } = req.body;
  
      // Validate request body
      if (!name || !email || !phone || !message || !placeId) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newEnquiry = new Enquiry({ name, email, phone, message, placeId });
      await newEnquiry.save();
      res.status(201).json({ message: "Enquiry submitted successfully!" });
    } catch (error) {
      console.error("🚨 Error saving enquiry:", error); // Log error details
      res.status(500).json({ error: error.message }); // Return detailed error
    }
  });
  

// Get all enquiries for a specific place
router.get("/:placeId", async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ placeId: req.params.placeId });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
