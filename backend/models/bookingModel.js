import mongoose, { Schema } from "mongoose";

const bookingSchema = new mongoose.Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Started", "Completed", "Accepted", "Cancelled"],
    default: "Pending",
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },

  bookingDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },

  charges: {
    type: Number,
    required: true,
    min: 0,
  },

  paymentMethod: { type: String, required: true,default : "Cash" }
});

const bookingModel =
  mongoose.models.booking || mongoose.model("Booking", bookingSchema);

export default bookingModel;
