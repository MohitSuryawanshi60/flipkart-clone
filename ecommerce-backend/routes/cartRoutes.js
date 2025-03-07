const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add to Cart Route
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from token
        const { productId, quantity } = req.body;

        // Validate Input
        if (!productId || !quantity) {
            return res.status(400).json({ error: "Product ID and quantity are required." });
        }

        // Ensure quantity is a positive number
        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be greater than 0." });
        }

        // Find Cart for User
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Check if Product Already in Cart
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        // Save Updated Cart
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully!", cart });

    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// ✅ Fetch Cart Items Route (NEW)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", cart: { products: [] } });
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

module.exports = router;
