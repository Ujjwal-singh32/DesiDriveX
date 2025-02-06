import express from "express";
import {
  admin_login,
  authenticateToken,
  deleteCar,
  deleteOwner,
  deleteUser,
  getCarDetails,
  getContactUsMessages,
  sendContactUsMessages,
  sendRejectEmail,
  sendSuccessEmail,
  totalOwners,
  totalUsers,
  updateCarVerification,
  updateContactUsMessage,
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

// api endpoints for the admin
adminRouter.post("/login", admin_login);
adminRouter.get("/pending-cars", getCarDetails);
adminRouter.patch("/update-verification/:carId", updateCarVerification);
adminRouter.delete("/delete-car/:carId", deleteCar);
adminRouter.get("/total-users", totalUsers);
adminRouter.get("/total-owners", totalOwners);
adminRouter.delete("/delete-user/:userId", deleteUser);
adminRouter.delete("/delete-owner/:ownerId", deleteOwner);
adminRouter.post("/send-success", sendSuccessEmail);
adminRouter.post("/send-reject", sendRejectEmail);
adminRouter.post("/contact-us-send", sendContactUsMessages);
adminRouter.get("/contact-us-get", getContactUsMessages);
adminRouter.patch("/contact-us-update/:_id" , updateContactUsMessage)
export default adminRouter;
