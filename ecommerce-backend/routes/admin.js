const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

const adminAuth = require("../middleware/auth");

// Check Admin Status
router.get("/check-admin", adminAuth, (req, res) => {
  res.json({ isAdmin: true, admin: req.admin });
});


//  Register Admin
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword, address } = req.body;

    // ✅ Check if all fields are provided
    if (!name || !email || !mobile || !password || !confirmPassword || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Check if Admin Already Exists
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    // ✅ Create Admin
    admin = new Admin({ name, email, mobile, password, address });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
