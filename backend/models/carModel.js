import mongoose, { Schema } from "mongoose";

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 2016,
    max: new Date().getFullYear(),
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: { type: Array, required: true },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerPhoneNumber: {
    type: String, 
    required: true,
  },
  type: {
    type: String,
    enum: ["SUV", "Sedan", "Sports", "Luxury"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Rented", "Under Maintenance"],
    default: "Available",
  },
  transmission: {
    type: String,
    enum: ["Automatic", "Manual"],
    required: true,
  },
  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false, 
  },
});

// Function to validate image count
function arrayLimit(val) {
  return val.length === 6;
}

const carModel = mongoose.models.car || mongoose.model("Car", carSchema);

export default carModel;
