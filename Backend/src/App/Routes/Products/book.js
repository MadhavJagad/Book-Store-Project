const express = require("express");
const multer = require("multer");
const {
  getBook,
  getAllBooks,
  createBook,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require("../../Controller/Product/bookController");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

//Routes
//http://localhost:3000/api/products

//Get all books || GET
router.get("/books", getAllBooks);

//Create a new book || POST
router.post("/create-book", upload.single("image"), createBook);

// Get book by ID || GET
router.get("/book/:id", getBook);



module.exports = router;
