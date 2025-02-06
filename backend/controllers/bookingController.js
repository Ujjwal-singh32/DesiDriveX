import bookingModel from "../models/bookingModel.js";
import mongoose from "mongoose";
// this api is for creating, deleting , updating , and getting all the bookings that belongs to a particular user or worker

const createBooking = async (req, res) => {
  const {
    userId,
    ownerId,
    carId,
    bookingDate,
    returnDate,
    charges,
    paymentMethod,
  } = req.body;

  // now add it to the database
  try {
    const newBooking = new bookingModel({
      userId,
      ownerId,
      status: "Pending",
      carId,
      bookingDate,
      returnDate,
      charges,
      paymentMethod,
    });

    await newBooking.save();
    //console.log("Booking created successfully");
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res
      .status(500)
      .json({ message: "Error creating booking", error: err.message });
  }
};

// to update the status
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.body;
  const { status } = req.body;
  try {
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res
      .status(500)
      .json({ message: "Error updating booking status", error: err.message });
  }
};

// get all bookings of the logged in user
// populate is used so that we can find the details directly from the worker id

const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await bookingModel.find({ userId });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }
    res.status(200).send({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res
      .status(500)
      .json({ message: "Error fetching user bookings", error: err.message });
  }
};

// get all bookings of the logged in worker
// populate is used so that we can find the details directly from the user id

const getOwnerBookings = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const newId = new mongoose.Types.ObjectId(ownerId);
    const bookings = await bookingModel.find({ ownerId:newId });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this Owner." });
    }
    res.status(200).send({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res
      .status(500)
      .json({ message: "Error fetching owner bookings", error: err.message });
  }
};

const getBooking = async (req, res) => {
  const { bookingId } = req.params;
 // console.log(bookingId)
  try {
    const bookings = await bookingModel.findById(bookingId);

    if (!bookings) {
      return res
        .status(404)
        .json({ message: "No bookings found for this id." });
    }
    res.status(200).send({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching booking:", err);
    res
      .status(500)
      .json({ message: "Error fetching booking", error: err.message });
  }
};
export {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  getOwnerBookings,
  getBooking
};
