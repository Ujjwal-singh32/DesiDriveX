import express from "express";
import validator from "validator";
import userModel from "../models/userModel.js";
import ownerModel from "../models/ownerModel.js";
import carModel from "../models/carModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import contactusModel from "../models/contactusModel.js";
import mongoose from "mongoose";
import bookingModel from "../models/bookingModel.js";
import notificationModel from "../models/notificationModel.js";
import chatModel from "../models/chatModel.js";
const admin_login = async (req, res) => {
  // we reuire admin feature beacuse anyone can add or remove products from the app
  // so we provide admin featire to some person so that they can only change the products present on the app
  // so check for the validation
  try {
    const { email, password } = req.body;
    const original_email = process.env.ADMIN_EMAIL;
    const original_password = process.env.ADMIN_PASSWORD;

    //console.log(original_email , original_password);

    if (email === original_email && password === original_password) {
      // send a token
      const token = jwt.sign(email + password, process.env.JWT_SECRET); // here when we verify the token we will require the email+password as matched correctly
      res.json({ success: true, token: token });
    } else {
      res.json({ success: false, message: "Invalid Email Or Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

const getCarDetails = async (req, res) => {
  try {
    // array of cars of the owner
    const cardata = await carModel.find({ isVerified: false });
    if (cardata.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No cars found for this carId.",
      });
    }
    res.status(200).json({
      success: true,
      cardata,
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching car.",
    });
  }
};

const updateCarVerification = async (req, res) => {
  try {
    const { carId } = req.params;
    // Find the car by ID
    const car = await carModel.findById(carId);
    // If car is not found, return a 404 response
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    //upate done
    const updatedCar = await carModel.findByIdAndUpdate(
      carId,
      { isVerified: true },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Car verification updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating car",
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;
    // Find and delete the car from the database
    const deletedCar = await carModel.findByIdAndDelete(carId);
    await bookingModel.deleteMany({ carId });
    if (!deletedCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting car",
    });
  }
};

const totalUsers = async (req, res) => {
  try {
    const totalUsers = await userModel.find({});

    res.status(200).json({
      success: true,
      users: totalUsers,
    });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching total users.",
    });
  }
};

const totalOwners = async (req, res) => {
  try {
    const totalOwners = await ownerModel.find({});

    res.status(200).json({
      success: true,
      owners: totalOwners,
    });
  } catch (error) {
    console.error("Error fetching total owners:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching total owners.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find and delete the user from the database
    const deleteduser = await userModel.findByIdAndDelete(userId);
    await notificationModel.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
    await bookingModel.deleteMany({ userId });
    if (!deleteduser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};
const deleteOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    // Find and delete the user from the database
    const deletedOwner = await ownerModel.findByIdAndDelete(ownerId);
    await notificationModel.deleteMany({
      $or: [{ senderId: ownerId }, { receiverId: ownerId }],
    });
    await bookingModel.deleteMany({ ownerId });
    await carModel.deleteMany({ ownerId });
    if (!deletedOwner) {
      return res
        .status(404)
        .json({ success: false, message: "owner not found" });
    }

    return res.status(200).json({
      success: true,
      message: "owner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting owner:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting owner",
    });
  }
};

const sendSuccessEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // use nodemailer for sending the email link
    // console.log(process.env.EMAIL_PASS);
    // console.log(process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"DesiDriveX" <desidrivex@gmail.com>',
      to: email,
      subject: "Congratulation Message",
      html: `
          <p>You requested to add your car to our App.</p>
         <p>So we have accepted your car now you can use it for bookings</p>
         <p>Happy Renting!!!!!<p/>
        `,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const sendRejectEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // use nodemailer for sending the email link
    // console.log(process.env.EMAIL_PASS);
    // console.log(process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"DesiDriveX" <desidrivex@gmail.com>',
      to: email,
      subject: "Rejection Message",
      html: `
        <p>You requested to add your car to our App.</p>
       <p>So we have Rejected your car beacuse it is not in well condition for our user</p>
       <p>Happy Renting!!!!!<p/>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "email sent successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const sendContactUsMessages = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    if (!name || !email || !phoneNumber || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = new contactusModel({
      name,
      email,
      phoneNumber,
      message,
    });
    await newMessage.save();

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getContactUsMessages = async (req, res) => {
  try {
    const messages = await contactusModel.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateContactUsMessage = async (req, res) => {
  try {
    const { _id } = req.params;

    // Log the received _id to ensure it's being passed correctly
    //console.log("Received _id:", _id);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid message Id" });
    }

    // Find and update the message
    const updatedMessage = await contactusModel.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(_id) },
      { hasRead: true },
      { new: true }
    );

    // Log the result of the update to check if it returned anything
    //console.log("Updated message:", updatedMessage);

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      updatedMessage,
    });
  } catch (error) {
    console.error("Error occurred during the update:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export {
  admin_login,
  authenticateToken,
  getCarDetails,
  updateCarVerification,
  deleteCar,
  totalOwners,
  totalUsers,
  deleteOwner,
  deleteUser,
  sendSuccessEmail,
  sendRejectEmail,
  sendContactUsMessages,
  getContactUsMessages,
  updateContactUsMessage,
};
