// routes/user.js
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 🔒 Protected: Get User Data
router.get("/getUserData", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

// ➕ Add to Cart
router.post("/addToCart", authMiddleware, async (req, res) => {
  const { item } = req.body;

  const user = await User.findById(req.userId);
  user.cart.push(item);
  await user.save();

  res.status(200).json({ message: "Item added to cart", cart: user.cart });
});

// 🧹 Clear Cart
router.post("/clearCart", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  user.cart = [];
  await user.save();

  res.status(200).json({ message: "Cart cleared", cart: [] });
});

module.exports = router;
