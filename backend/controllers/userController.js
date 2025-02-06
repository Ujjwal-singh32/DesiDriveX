import express from "express";
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// token creation

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      pinCode,
      state,
      password,
      confirmPassword,
      email,
    } = req.body; // extract from the body

    //  console.log(req.body)
    // check if user with that email already exists or not
    const user_email_exists = await userModel.findOne({ email });

    // if exist throw an error
    if (user_email_exists) {
      return res.json({ success: false, message: "User Already Registered" });
    }

    //now we validate the email as well as the password and store it

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter A Valid Email" });
    }

    // check for the password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password Must Contains 8 Characters",
      });
    }
    // console.log(password)
    // console.log(confirmPassword)
    // now check the password and confirmpassword matching
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password didn't Matched",
      });
    }

    // now hash the password
    const salt = await bcrypt.genSalt(10); // salting round is 10
    const hashed_password = await bcrypt.hash(password, salt);

    // upload the image to the cloudinary and save the url in the database
    let image = req.file;
    let imageUrl = null;
    if (image) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    // create the user with the field provided
    const newUser = new userModel({
      name,
      phoneNumber,
      pinCode,
      state,
      password: hashed_password,
      email,
      profilePic: imageUrl,
    });

    // now  save the user to the database
    const user = await newUser.save();
    // also create a token for the user
    const token = createToken(user._id);

    res.json({ success: true, token, message: "User Registered Successfully" });
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

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    // search for the user
    const user_exists = await userModel.findOne({ email });
    // now check the email validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter A Valid Email" });
    }
    // check if user with that email exists or not
    if (!user_exists) {
      return res.json({ success: false, message: "User Doesn't Exists" });
    }

    // check for the password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password Must Contains 8 Characters",
      });
    }

    // now check for the correct and wrong password

    const check_password_match = await bcrypt.compare(
      password,
      user_exists.password
    );

    if (check_password_match) {
      const token = createToken(user_exists._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      pinCode,
      state,
      phoneNumber,
      email,
    } = req.body;
    //console.log("req.body" , req.body);
    const updatedData = {
      name,
      pinCode,
      state,
      phoneNumber,
      email,
    };
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    if (imageUrl) {
      updatedData.profilePic = imageUrl;
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

const userDetailsById = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).send({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error", error });
  }
};

export {
  registerUser,
  authenticateToken,
  loginUser,
  userDetails,
  updateProfile,
  userDetailsById
};
