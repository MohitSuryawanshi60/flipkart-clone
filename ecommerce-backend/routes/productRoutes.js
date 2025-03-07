// const express = require("express");
// const Product = require("../models/Product"); // ✅ Correct import


// const router = express.Router();
// // Add new product
// router.post("/", async (req, res) => {
//   try {
//     const { name, price, description, image, category, stock } = req.body;

//     // Validate input
//     if (!name || !price || !description || !image || !category || stock < 0) {
//       return res.status(400).json({ message: "All fields are required and stock cannot be negative" });
//     }

//     const newProduct = new Product({ name, price, description, image, category, stock });
//     await newProduct.save();

//     res.status(201).json({ message: "Product added successfully", Product: newProduct });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // Get all products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json({ products });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const Product = require("../models/Product"); // Correct import

const router = express.Router();

// Add new product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    // Validate input
    if (!name || !price || !description || !image || !category || stock === undefined || stock < 0) {
      return res.status(400).json({ message: "All fields are required and stock cannot be negative" });
    }

    // Create new product
    const newProduct = new Product({ name, price, description, image, category, stock });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;

