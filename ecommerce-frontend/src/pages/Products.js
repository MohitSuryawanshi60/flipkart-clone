
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `https://flipkart-cloneb.vercel.app/api/products?category=${category}`
          : "https://flipkart-cloneb.vercel.app/api/products";

        const response = await axios.get(url);
        setProducts(response.data.products || []);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) return;

      try {
        const response = await axios.get("https://flipkart-cloneb.vercel.app/api/admin/check-admin", {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        console.error("Admin verification failed.");
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const handleAddProduct = () => {
    if (!isAdmin) {
      alert("Only admins can add products. Redirecting to admin login.");
      navigate("/admin-login");
    } else {
      navigate("/productadd");
    }
  };

  return (
    <div className="home-container">
      {/* ✅ Navbar */}
      <nav className="navbar">
        <h2 className="logo">Flipkart</h2>
        <div className="navbar-links">
          <a href="/home">Home</a>
          <button onClick={handleAddProduct} className="add-product-button">
            Add Product
          </button>
          {isAdmin && <button onClick={handleLogout} className="logout-button">Logout</button>}
        </div>
      </nav>

      {/* Products Section */}
      <section className="products-section">
        <h2 className="section-title">
          {category ? `${category} Products` : "All Products"}
        </h2>
        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="product-list">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="product-image" />
                  )}
                  <h3>{product.name}</h3>
                  <p className="product-price">Rs.{product.price.toFixed(2)}</p>
                  <p className="product-description">{product.description}</p>
                </div>
              ))
            ) : (
              <p className="no-products">No products found.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
