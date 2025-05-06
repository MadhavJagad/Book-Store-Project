const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getCart,
} = require("../../Controller/Product/cartController");

//Routes
//http://localhost:3000/api/cart

router.post("/add-cart", addToCart);
router.get("/get-cart", getCart);
router.delete("/remove-cart/:bookId", removeFromCart);
router.put("/update-cart/:bookId", updateCartItem);
router.delete("/clear-cart", clearCart);

module.exports = router;
