import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import ownerModel from "../models/ownerModel.js";
// token creation

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerOwner = async (req, res) => {
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
    // check if owner with that email already exists or not
    const owner_email_exists = await ownerModel.findOne({ email });

    // if exist throw an error
    if (owner_email_exists) {
      return res.json({ success: false, message: "Owner Already Registered" });
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

    // create the owner with the field provided
    const newowner = new ownerModel({
      name,
      phoneNumber,
      pinCode,
      state,
      password: hashed_password,
      email,
      profilePic: imageUrl,
    });

    // now  save the owner to the database
    const owner = await newowner.save();
    // also create a token for the owner
    const token = createToken(owner._id);

    res.json({
      success: true,
      token,
      message: "owner Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, owner) => {
    if (err) return res.status(403).send({ message: "Invalid token" });
    req.owner = owner;
    next();
  });
};

const loginOwner = async (req, res) => {
  try {
    const { password, email } = req.body;
    // search for the owner
    const owner_exists = await ownerModel.findOne({ email });
    // now check the email validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter A Valid Email" });
    }
    // check if owner with that email exists or not
    if (!owner_exists) {
      return res.json({ success: false, message: "owner Doesn't Exists" });
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
      owner_exists.password
    );

    if (check_password_match) {
      const token = createToken(owner_exists._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const ownerDetails = async (req, res) => {
  try {
    const owner = await ownerModel.findById(req.owner.id);

    if (!owner) {
      return res
        .status(404)
        .send({ success: false, message: "owner not found" });
    }
    res.status(200).send({ success: true, owner });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { name, pinCode, state, phoneNumber, email } = req.body;
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
    const updatedowner = await ownerModel.findByIdAndUpdate(
      req.owner.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedowner) {
      return res
        .status(404)
        .json({ success: false, message: "owner not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      owner: updatedowner,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

const findOwnerByphone = async (req, res) => {
  const { phoneNumber } = req.params;
  const owner = await ownerModel.findOne({ phoneNumber });

  try {
    if (!owner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found" });
    }

    res.status(200).json({ success: true, owner });
  } catch (error) {
    console.error("Error finding owner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  registerOwner,
  authenticateToken,
  loginOwner,
  ownerDetails,
  updateProfile,
  findOwnerByphone,
};
