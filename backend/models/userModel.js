import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[6-9]\d{9}$/.test(value); // this function validates the phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    pinCode: { type: Number, required: true },
    state: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    profilePic: { type: String, default: "" },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("User", userSchema);

export default userModel;
