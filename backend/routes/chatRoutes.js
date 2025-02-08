import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
const chatRouter = express.Router();

chatRouter.post("/send", sendMessage);
chatRouter.get("/messages/:bookingId/:senderId/:receiverId", getMessages);

export default chatRouter;
