import express from "express";
import validator from "validator";
import carModel from "../models/carModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import bookingModel from "../models/bookingModel.js";
import chatModel from "../models/chatModel.js";
import mongoose from "mongoose";
// token creation

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerCar = async (req, res) => {
  try {
    const {
      name,
      model,
      year,
      pricePerDay,
      description,
      ownerId,
      type,
      transmission,
      fuelType,
      ownerName,
      ownerPhoneNumber,
    } = req.body; // extract from the body

    //  console.log(req.body)

    // upload the image to the cloudinary and save the url in the database
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image5 = req.files.image5 && req.files.image5[0];
    const image6 = req.files.image6 && req.files.image6[0];

    // check for the undefined images
    const images = [image1, image2, image3, image4, image5, image6].filter(
      (item) => item !== undefined
    );

    let image_url = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // now gather all the the details and wrap it according to the model and save it into the database
    const carData = {
      name,
      model,
      year,
      pricePerDay,
      description,
      ownerId,
      type,
      transmission,
      fuelType,
      images: image_url,
      ownerName,
      ownerPhoneNumber,
    };

    //console.log("This is the carData",carData);
    const car = new carModel(carData);
    await car.save();
    res.json({ success: true, message: "Sent to Admin" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const totalCars = async (req, res) => {
  try {
    const { ownerId } = req.params;
    // array of cars of the owner
    const cars = await carModel.find({ ownerId, isVerified: true });
    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cars found for this owner.",
      });
    }
    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cars.",
    });
  }
};

const updateCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const { name, pricePerDay, description, status } = req.body;
    // console.log("req" ,req.file)
    // Convert pricePerDay to a number if needed
    const car = await carModel.findById(carId);
    const updatedData = {
      name,
      pricePerDay,
      description,
      status,
      images: [],
    };
    for (let i = 1; i <= 6; i++) {
      const imageFile = req.files[`image${i}`] && req.files[`image${i}`][0]; // Check if a file is uploaded for this slot

      if (imageFile) {
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        updatedData.images.push(result.secure_url); // Add new image URL to images array
      } else {
        // If no new image is uploaded, retain the old image (from current car data)
        updatedData.images.push(car.images[i - 1]);
      }
    }

    // console.log("updated data:",updatedData)
    // Update the car in the database
    const updatedCar = await carModel.findByIdAndUpdate(carId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
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

const getCarDetails = async (req, res) => {
  try {
    const { carId } = req.params;
    // console.log(carId)
    // array of cars of the owner
    const cardata = await carModel.find({ _id: carId });
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

// to delete car
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

const totalCarsToDisplay = async (req, res) => {
  try {
    const cars = await carModel.find({ isVerified: true });

    // no cars exists
    if (cars.length === 0) {
      return res.status(404).json({ success: false, message: "No cars found" });
    }

    // Return the list of cars
    return res.status(200).json({
      success: true,
      message: "Cars retrieved successfully",
      cars: cars,
    });
  } catch (error) {
    console.error("Error retrieving cars:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving cars",
    });
  }
};

const totalBookings = async (req, res) => {
  try {
    const { carId } = req.params;

    const bookingCount = await bookingModel.countDocuments({
      carId,
      status: { $ne: "Cancelled" },
    });

    res.status(200).json({ success: true, totalBookings: bookingCount });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching total bookings",
        error,
      });
  }
};

const totalRevenue = async (req, res) => {
  try {
    const { carId } = req.params;

    // Ensure carId is converted to ObjectId for MongoDB Atlas compatibility
    const objectIdCarId = new mongoose.Types.ObjectId(carId);

    const revenue = await bookingModel.aggregate([
      { $match: { carId: objectIdCarId, status: { $ne: "Cancelled" } } }, // Match bookings by carId
      { $group: { _id: null, totalRevenue: { $sum: "$charges" } } },
    ]);

    // console.log(revenue);

    // Handle cases where no revenue exists
    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    res.status(200).json({ success: true, totalRevenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching total revenue",
      error: error.message,
    });
  }
};
export {
  registerCar,
  totalCars,
  updateCar,
  getCarDetails,
  deleteCar,
  totalCarsToDisplay,
  totalRevenue,
  totalBookings,
};
