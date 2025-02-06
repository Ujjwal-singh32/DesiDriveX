import mongoose, { Schema } from "mongoose";

const contactusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  hasRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const contactusModel =
  mongoose.models.contactus || mongoose.model("contactus", contactusSchema);

export default contactusModel;
