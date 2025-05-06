const userModel = require("../../Model/Auth/auth.model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const forgetPasswordTemp = require("../../Middleware/forgetPasswordTemp");

//Get the user information for profile page
const userProfile = async (req, res) => {
  try {
    //Get the user details from the database based on the id in the request body.
    const user = await userModel.findById({ _id: req.body.id });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //hide the user Password
    user.password = undefined;
    //send Response
    res.status(200).send({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to get user profile",
      error,
    });
  }
};

//Update user information
const userUpdate = async (req, res) => {
  try {
    //Find the user
    const user = await userModel.findById({ _id: req.body.id });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //Update the user
    const { userName, phone, address, city, state, zip } = req.body;
    if (userName) user.userName = userName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (zip) user.zip = zip;
    //Save the updated user
    await user.save();
    //send Response
    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update user profile",
      error,
    });
  }
};

//Update user password
const userPasswordUpdate = async (req, res) => {
  try {
    //Find user
    const user = await userModel.findById({ _id: req.body.id });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //Get data(Password) from user
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide both old password and new password",
      });
    }
    //Compare Password | check user password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid old password",
      });
    }
    //Hashing the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    //Update the user password
    user.password = hashedPassword;
    //Save the updated user
    await user.save();
    //send Response
    res.status(200).send({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update user password",
      error,
    });
  }
};

//User Logout function || Delete the user
const userLogout = async (req, res) => {
  try {
    //Delete the user from the database
    await userModel.findByIdAndDelete(req.params.id);
    //send Response
    return res.status(200).send({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to logout user",
      error,
    });
  }
};

//Forget Password
const userForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide email",
      });
    }
    //check if email is exist
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Configure nodemailer transporter (do this once, outside the function)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true, // or your email service
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    // Generate OTP (6-digit code)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // OTP valid for 15 minutes
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Save OTP and expiry to user in database
    user.resetPasswordOTP = otp;
    // const hashedOTP = await bcrypt.hash(otp, 10);
    // user.resetPasswordOTP = hashedOTP;
    // const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);


    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    // Email options
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: forgetPasswordTemp.replace("{otp}", otp),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    //send Response and  Email with Reset Link
    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to send password reset link",
      error,
    });
  }
};

//Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).send({
        success: false,
        message: "Please provide both email and OTP",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP exists and is not expired
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).send({
        success: false,
        message: "OTP not requested or expired",
      });
    }

    // Check OTP expiry
    if (user.resetPasswordOTPExpiry < new Date()) {
      return res.status(400).send({
        success: false,
        message: "OTP has expired",
      });
    }

    // Compare OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid - you might want to generate a token here for the next step
    // or just mark the user as verified for password reset
    user.isOTPVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      // You might want to include a token for the next step
      data: {
        email: user.email,
        resetToken: "generate-a-token-here-if-needed", // Optional
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to verify OTP",
      error: error.message, // Better to only send the message in production
    });
  }
};

//Reset Password
const userResetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validation
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide email, new password and confirm password",
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP was confirmed
    if (!user.isOTPVerified) {
      return res.status(400).send({
        success: false,
        message: "OTP not verified",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.isOTPVerified = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to reset password",
      error: error.message, // Better to only send message in production
    });
  }
};
module.exports = {
  userLogout,
  userProfile,
  userUpdate,
  userPasswordUpdate,
  userForgetPassword,
  verifyOTP,
  userResetPassword,
};
