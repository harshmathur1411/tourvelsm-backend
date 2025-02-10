const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true }, // Reference to a place
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
