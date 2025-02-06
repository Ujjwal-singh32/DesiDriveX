import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ownerModel from "../models/ownerModel.js";

const createPasswordResetToken = (id) => {
  return jwt.sign({ id, type: "password-reset" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const forgotUser = async (req, res) => {
  const { email } = req.body;
  try {
    // find that user with email exists or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email doesn't exist" });
    }

    // make a token ans save to the database and save the user
    const resetToken = createPasswordResetToken(user._id);
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour from now
    await user.save();

    const resetUrl = `${process.env.USER_URL}/reset-password/${resetToken}`;

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
      subject: "Password Reset Request",
      html: `
          <p>You requested to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <p>This link is valid for 1 hour.</p>
        `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message: "Password reset email sent successfully",
        success: true,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const resetUser = async (req, res) => {
  // take the token verify it and update the password
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // search for the user
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // check and make sure token is not expired
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save the user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully!", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
};

const forgotOwner = async (req, res) => {
  const { email } = req.body;
  try {
    // find that owner with email exists or not
    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      return res
        .status(404)
        .json({ message: "Owner with this email doesn't exist" });
    }

    // make a token ans save to the database and save the owner
    const resetToken = createPasswordResetToken(owner._id);
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    owner.resetPasswordToken = hashedToken;
    owner.resetPasswordExpire = Date.now() + 3600000; // 1 hour from now
    await owner.save();

    const resetUrl = `${process.env.OWNER_URL}/reset-password/${resetToken}`;

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
      subject: "Password Reset Request",
      html: `
          <p>You requested to reset your password.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <p>This link is valid for 1 hour.</p>
        `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message: "Password reset email sent successfully",
        success: true,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

const resetOwner = async (req, res) => {
  // take the token verify it and update the password
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // search for the user
    const owner = await ownerModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // check and make sure token is not expired
    });
    if (!owner) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save the user
    owner.password = hashedPassword;
    owner.resetPasswordToken = undefined;
    owner.resetPasswordExpire = undefined;

    await owner.save();
    res
      .status(200)
      .json({ message: "Password updated successfully!", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
};
export { forgotUser, resetUser, forgotOwner, resetOwner };
