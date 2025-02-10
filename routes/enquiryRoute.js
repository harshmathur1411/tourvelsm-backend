const express = require("express");
const router = express.Router();
const Enquiry = require("../models/enquiry");

// Create an enquiry
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, placeId } = req.body;
    const newEnquiry = new Enquiry({ name, email, phone, message, placeId });
    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
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
