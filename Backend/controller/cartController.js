// cartController.js
const Cart = require("../models/cartSchema");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/ApiFeatures");

// Add a new item to the cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cartItem = new Cart({ userId, productId, quantity });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all cart items for a user
exports.getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
