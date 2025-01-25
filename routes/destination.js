const express = require('express');
const Destination = require('../models/destination');

const router = express.Router();

// Create a new destination (bulk insert)
// Create a new destination (bulk insert or single insert)
router.post("/destinations", async (req, res) => {
    const destinations = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single and array
  
    if (destinations.length === 0) {
      return res.status(400).json({ message: "An array of destinations is required!" });
    }
  
    for (const destination of destinations) {
      const { name, description, image } = destination;
      if (!name || !description || !image) {
        return res.status(400).json({ message: "All fields (name, description, image) are required!" });
      }
  
      // Validate each package (if any)
      if (destination.packages && Array.isArray(destination.packages)) {
        for (const pkg of destination.packages) {
          const { name, description, price } = pkg;
          if (!name || !description || !price) {
            return res.status(400).json({ message: "All fields (name, description, price) are required in each package!" });
          }
        }
      }
    }
  
    try {
      const savedDestinations = await Destination.insertMany(destinations);
      res.status(201).json({
        message: "Destinations added successfully!",
        destinations: savedDestinations,
      });
    } catch (error) {
      console.error("Error adding destinations:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

// Fetch all destinations
router.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch destination by name
router.get("/destinations/search", async (req, res) => {
  const { name } = req.query;
  try {
    const destinations = await Destination.find({
      name: { $regex: name, $options: "i" },
    });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch destination by ID
router.get("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update a destination by ID (PUT)
router.put('/destinations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, image, bestTime, location, packages } = req.body;

  if (!name && !description && !image && !packages) {
    return res.status(400).json({
      message: "At least one field (name, description, image, or packages) must be provided for update.",
    });
  }

  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(bestTime && { bestTime }),
        ...(location && { location }),
        ...(image && { image }),
        ...(packages && { packages }), // Update the packages if provided
      },
      { new: true }
    );

    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    res.status(200).json({
      message: "Destination updated successfully!",
      destination: updatedDestination,
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Partial update a destination by ID (PATCH)
router.patch('/destinations/:id', async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      message: "At least one field must be provided for update.",
    });
  }

  // Check if packages are part of the update, and validate if provided
  if (updateFields.packages && Array.isArray(updateFields.packages)) {
    for (const pkg of updateFields.packages) {
      const { name, description, price } = pkg;
      if (!name || !description || !price) {
        return res.status(400).json({ message: "All fields (name, description, price) are required in each package!" });
      }
    }
  }

  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    res.status(200).json({
      message: "Destination updated successfully!",
      destination: updatedDestination,
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete

router.delete('/destinations/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Attempt to find and delete the destination by its ID
      const deletedDestination = await Destination.findByIdAndDelete(id);
  
      // If no destination is found, return a 404 error
      if (!deletedDestination) {
        return res.status(404).json({ message: "Destination not found." });
      }
  
      // If deletion is successful, return a success response
      res.status(200).json({
        message: "Destination deleted successfully!",
        destination: deletedDestination,
      });
    } catch (error) {
      // Catch any server errors and return a 500 status code
      console.error("Error deleting destination:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

module.exports = router;
