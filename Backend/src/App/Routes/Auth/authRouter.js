const express = require("express");
const {
  userRegistration,
  userLogin,
} = require("../../Controller/Auth/authController");

//Router Object
const router = express.Router();

//http://localhost:3000/api/auth

//User Registration || POST
router.post("/register", userRegistration);

//User Login || POST
router.post("/login", userLogin);

//Export the router
module.exports = router;
