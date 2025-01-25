const express = require("express");
const router = express.Router();
const AboutUs = require("../models/aboutus");


// Create About Us content
router.post("/", async (req, res) => {
    const { title, description, mission, vision, values, image } = req.body;
    try {
      const newAboutUsContent = new AboutUs({
        title,
        description,
        mission,
        vision,
        values,
        image,
      });
      const savedContent = await newAboutUsContent.save();
      res.status(201).json(savedContent);
    } catch (error) {
      res.status(500).json({ message: "Error creating About Us content", error });
    }
  });
  

// Fetch the About Us content
router.get("/", async (req, res) => {
  try {
    const aboutUsContent = await AboutUs.findOne(); // Assuming only one record exists
    res.json(aboutUsContent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching About Us content", error });
  }
});

// Update About Us content
router.put("/", async (req, res) => {
  const { title, description, mission, vision, values, image } = req.body;
  try {
    const aboutUsContent = await AboutUs.findOneAndUpdate(
      {},
      { title, description, mission, vision, values, image },
      { new: true, upsert: true }
    );
    res.json(aboutUsContent);
  } catch (error) {
    res.status(500).json({ message: "Error updating About Us content", error });
  }
});

module.exports = router;
