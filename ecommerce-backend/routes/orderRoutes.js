const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Place an Order
router.post("/", async (req, res) => {
  try {
    const { fullName, address, phone, cartItems, paymentMethod } = req.body;
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const newOrder = new Order({ fullName, address, phone, cartItems, paymentMethod, totalAmount });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

//  Get all Orders (For Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

router.delete("/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Confirmed";
    await order.save();

    res.json({ message: "Order confirmed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Export the router (CommonJS)
module.exports = router;
