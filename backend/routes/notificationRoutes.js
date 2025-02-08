import express from "express";
import {
  sendNotification,
  getNotification,
  updateNotification,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/new-notification", sendNotification);
notificationRouter.put(
  "/update-notification/:notificationId",
  updateNotification
);
notificationRouter.get("/get-notification/:id", getNotification);

export default notificationRouter;
