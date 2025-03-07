import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductAdd.css"; // Import the CSS file

const ProductAdd = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: 1,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://flipkart-cloneb.vercel.app/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setSuccess("Product added successfully!");
      setError("");

      // Clear the form
      setProduct({ name: "", price: "", description: "", image: "", category: "", stock: 1 });

      // Redirect to product listing page after 1 second
      setTimeout(() => {
        navigate("/products");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="product-add-container">
      <h2>Add New Product</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="product-add-form" onSubmit={handleSubmit}>
        <label>Product Name:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={product.description} onChange={handleChange} required />

        <label>Category:</label>
        <input type="text" name="category" value={product.category} onChange={handleChange} required />

        <label>Stock:</label>
        <input type="number" name="stock" value={product.stock} onChange={handleChange} required />

        <label>Image URL:</label>
        <input type="text" name="image" value={product.image} onChange={handleChange} placeholder="Enter image URL" required />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductAdd;
