const express = require("express");
const {
  userLogout,
  userProfile,
  userUpdate,
  userPasswordUpdate,
  userForgetPassword,
  verifyOTP,
  userResetPassword,
} = require("../../Controller/Auth/userController");
const authMiddleware = require("../../Middleware/authMiddleware");

//Router Object
const router = express.Router();

//http://localhost:3000/api/auth

//Routes
//Get user information || GET
router.get("/getuser", authMiddleware, userProfile);

//Update user || POST
router.post("/update-user", authMiddleware, userUpdate);

//Update the Password || POST
router.post("/update-password", authMiddleware, userPasswordUpdate);

//Logout user || Delete user || DELETE
router.delete("/logout/:id", authMiddleware, userLogout);

//Forget password || POST
router.post("/forget-password", userForgetPassword);

//Verify OTP || POST
router.post("/verify-otp", verifyOTP);

//Reset the Password || POST
router.post("/reset-password", userResetPassword);

//Export the router
module.exports = router;
