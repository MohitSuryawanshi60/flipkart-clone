const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// ✅ Register a New User
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validate input fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase(); // Normalize email

        // Check if user already exists (by email or phone)
        const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone already registered" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, email: normalizedEmail, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        console.error("Error in register:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ User Login
router.post("/login", async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ message: "Email or phone is required" });
        }

        // Check if user exists (by email or phone)
        const user = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { phone }] });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "Login Successful",
            token,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }, // Send user details excluding password
        });
    } catch (err) {
        console.error("Error in login:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
