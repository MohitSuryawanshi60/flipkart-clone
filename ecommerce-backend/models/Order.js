const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  phone: String,
  cartItems: Array,
  paymentMethod: String,
  totalAmount: Number,
  status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// ✅ Export using CommonJS
module.exports = Order;
