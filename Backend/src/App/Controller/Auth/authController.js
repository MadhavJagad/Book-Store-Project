const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const userModel = require("../../Model/Auth/auth.model");

//User Registration
const userRegistration = async (req, res) => {
  try {
    const { userName, email, phone, address, state, city, zip, password } =
      req.body;
    //validation
    if (
      !userName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !zip ||
      !state ||
      !password
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    //check if user is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }
    //Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create New User
    const user = await userModel.create({
      userName,
      email,
      phone,
      address,
      state,
      city,
      zip,
      password: hashedPassword,
    });
    //Save User and send response
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("userRegistration Error", error);
    res.status(500).send({
      success: false,
      message: "Failed to register user",
      error,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide both email and password",
      });
    }
    //check User if user is not registered
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //Compare Password | check user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }
    //generate JWT
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    // const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.log("user Login", error);
    res.status(500).send({
      success: false,
      message: "Failed to login user",
      error,
    });
  }
};

module.exports = { userRegistration, userLogin };
