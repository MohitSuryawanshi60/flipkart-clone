// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String },
//     image: { type: String }, // URL of product image
//     category: { type: String },
//     stock: { type: Number, default: 1 },
// }, { timestamps: true });
// module.exports = mongoose.model("Product", ProductSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String }, // Cloudinary Image URL
    stock: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

