import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  bookingId: { type: String, required: true },
  messages: [
    {
      text: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const chatModel = mongoose.models.Chats || mongoose.model("Chats", chatSchema);

export default chatModel;
