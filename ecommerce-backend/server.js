const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("./models/Admin");



// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// // ✅ Correct CORS Configuration
app.use(cors({
    origin: "",
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));


// Import API Routes
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecommerce-products",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
});


// // ✅ Test Route
app.get('/', (req, res) => {
    res.send("Hello Hotel Backend API");
    console.log("Hello Hotel Backend API");
});

// Admin Registration Route
app.post("/api/admin/register", async (req, res) => {
    try {
        const { name, email, mobile, password, address } = req.body;

        let existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ name, email, mobile, password: hashedPassword, address });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Admin Login Route
app.post("/api/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔹 Admin Login Attempt:", email);

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: admin._id, email: admin.email, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", token, admin });
    } catch (error) {
        console.error("Admin Login Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cors = require("cors");
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("./models/Admin");

// // Initialize Express App
// const app = express();
// app.use(express.json());

// // ✅ Correct CORS Configuration
// app.use(cors({
//     origin: "https://hotel-backend-xi.vercel.app",
//     methods: ["POST", "GET", "DELETE", "PUT"],
//     credentials: true
// }));

// // ✅ MongoDB Connection - Fixed Syntax
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch(err => {
//         console.error("❌ MongoDB Connection Error:", err);
//         process.exit(1);
//     });

// // ✅ Cloudinary Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Multer Storage for Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "ecommerce-products",
//         allowed_formats: ["jpg", "png", "jpeg"],
//     },
// });
// const upload = multer({ storage });

// // ✅ Import API Routes (Ensure these files exist)
// const authRoutes = require("./routes/auth");
// const cartRoutes = require("./routes/cartRoutes");
// const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");

// app.use("/api/auth", authRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// // ✅ Test Route
// app.get('/', (req, res) => {
//     res.send("Hello Hotel Backend API");
//     console.log("Hello Hotel Backend API");
// });

// // ✅ Admin Registration Route
// app.post("/api/admin/register", async (req, res) => {
//     try {
//         const { name, email, mobile, password, address } = req.body;

//         let existingAdmin = await Admin.findOne({ email });
//         if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newAdmin = new Admin({ name, email, mobile, password: hashedPassword, address });
//         await newAdmin.save();

//         res.status(201).json({ message: "Admin registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Admin Login Route
// app.post("/api/admin/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log("🔹 Admin Login Attempt:", email);

//         const admin = await Admin.findOne({ email });
//         if (!admin) return res.status(400).json({ message: "Admin not found" });

//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//         const token = jwt.sign(
//             { id: admin._id, email: admin.email, isAdmin: true },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         res.json({ message: "Login successful", token, admin });
//     } catch (error) {
//         console.error("Admin Login Error:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

