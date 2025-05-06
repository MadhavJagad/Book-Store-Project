const express = require("express");
const cors = require("cors");
// const path = require("path");
const connectDb = require("./App/Config/db");
require("dotenv").config();

const app = express();

//DB connection
connectDb();

//middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

//Routes
//http://localhost:3000/api/auth
//http://localhost:3000/api/products
//http://localhost:3000/api/cart

app.use("/api/auth", require("./App/Routes/Auth/authRouter"));
app.use("/api/auth", require("./App/Routes/Auth/userRouter"));
app.use("/api/products", require("./App/Routes/Products/book"));
app.use("/api/cart", require("./App/Routes/Products/cart"));

// Serve static files (like images in the 'uploads' folder)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Listen
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
