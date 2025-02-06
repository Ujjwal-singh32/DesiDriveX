import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  message: { type: String, required: true },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  createdAt: { type: Date, default: Date.now },
});

const notificationModel =
  mongoose.models.notification ||
  mongoose.model("notificationModel", notificationSchema);

export default notificationModel;
