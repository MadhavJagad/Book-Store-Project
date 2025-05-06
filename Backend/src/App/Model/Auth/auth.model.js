const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // userRole: {
  //   type: String,
  //   default: "User",
  // },
  resetPasswordOTP: String,
  resetPasswordOTPExpiry: Date,
  isOTPVerified: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
