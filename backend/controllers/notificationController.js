import notificationModel from "../models/notificationModel.js";
import mongoose from "mongoose";
const sendNotification = async (req, res) => {
  const { bookingId, senderId, receiverId, message } = req.body;
  //console.log(req.body)
  try {
    const newNotification = new notificationModel({
      bookingId,
      senderId,
      receiverId,
      message,
    });
    await newNotification.save();
    return res.status(201).json({
      success: true,
      message: "Notification sent successfully.",
      data: newNotification,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to send notification." });
  }
};

const updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await notificationModel.findOne({
      _id: notificationId,
    });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.status = "read";
    await notification.save();
    return res.status(200).json({
      success: true,
      message: "notification status updated to 'Completed'.",
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification status.",
    });
  }
};

const getNotification = async (req, res) => {
  try {
    const id = req.params;
    const Id = new mongoose.Types.ObjectId(id);
    const notifications = await notificationModel
      .find({
        $or: [{ receiverId: Id }],
      })
      .sort({ createdAt: -1 });

    // console.log(notifications);
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch notifications." });
  }
};

export { sendNotification, updateNotification, getNotification };
