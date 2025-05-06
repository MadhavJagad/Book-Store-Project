const mongoose = require("mongoose");

// Connect to MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to database: -  ${mongoose.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
