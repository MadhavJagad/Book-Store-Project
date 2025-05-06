const CartModel = require("../../Model/Books/cart.model");
const BookModel = require("../../Model/Books/book.model");

const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const userId = req.body.id; // Get user ID from authMiddleware

    // Validation
    if (!bookId) {
      return res.status(400).send({
        success: false,
        message: "Please provide book ID",
      });
    }

    // Check if book exists
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).send({
        success: false,
        message: "Book not found",
      });
    }

    // Find user's cart or create one if it doesn't exist
    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      // Create new cart with user ID
      cart = new CartModel({
        user: userId, // This was missing
        items: [],
      });
    }

    // Check if the book is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if book already exists in cart
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item to cart
      cart.items.push({
        book: bookId,
        quantity: quantity || 1,
      });
    }

    // Update the updatedAt timestamp
    cart.updatedAt = new Date();

    // Save the cart
    await cart.save();

    // Populate book details in the response
    await cart.populate("items.book");

    res.status(200).send({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.log("addToCart Error", error);
    res.status(500).send({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.body.id; // From authMiddleware

    const cart = await CartModel.findOne({ user: userId }).populate(
      "items.book"
    );

    if (!cart) {
      return res.status(200).send({
        success: true,
        message: "Cart is empty",
        cart: { items: [] },
      });
    }

    res.status(200).send({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.body.id; // From authMiddleware

    // Validation
    if (!bookId) {
      return res.status(400).send({
        success: false,
        message: "Please provide book ID",
      });
    }

    // Find user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove the item from cart
    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    // Update the updatedAt timestamp
    cart.updatedAt = new Date();

    // Save the cart
    await cart.save();

    // Populate book details in the response
    await cart.populate("items.book");

    res.status(200).send({
      success: true,
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const userId = req.body.id; // From authMiddleware

    // Validation
    if (!bookId || !quantity || quantity < 1) {
      return res.status(400).send({
        success: false,
        message: "Please provide valid book ID and quantity",
      });
    }

    // Find user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (itemIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Update the updatedAt timestamp
    cart.updatedAt = new Date();

    // Save the cart
    await cart.save();

    // Populate book details in the response
    await cart.populate("items.book");

    res.status(200).send({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.body.id; // From authMiddleware

    // Find user's cart and clear items
    const cart = await CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], updatedAt: new Date() } },
      { new: true }
    ).populate("items.book");

    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};
