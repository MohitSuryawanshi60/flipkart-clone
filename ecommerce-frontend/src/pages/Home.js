import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";
import "./Products.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All"); //Category state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.products || response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  //Add to cart function (requires login)
  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to add items to the cart.");
      navigate("/login");
      return;
    }

    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  //Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="home-container">
      {/*Navbar */}
      <nav className="navbar">
        <h2 className="logo">Flipkart</h2>
        <div className="navbar-links">
          <a href="/home">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          {/*Show Login or Logout based on user authentication */}
          {localStorage.getItem("token") ? (
            <a href="/login" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="logout-button">
              Logout
            </a>
          ) : (
            <a href="/login" className="login-button">Login</a>
          )}
        </div>
      </nav>

      {/*Category Section */}
      <section className="categories">
        <h3 className="section-title">Top Categories</h3>
        <div className="category-list">
          {["All", "Electronics", "Clothing", "Home & Furniture", "Books", "Beauty & Health"].map((category) => (
            <div 
              key={category} 
              className={`category-card ${selectedCategory === category ? "active" : ""}`} 
              onClick={() => setSelectedCategory(category)} //Click event to filter
            >
              {category}
            </div>
          ))}
        </div>
      </section>

      {/*Products Section */}
      <section className="products-section">
        <h2 className="section-title">{selectedCategory} Products</h2>
        {loading ? (
          <p className="loading-message">Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="product-list">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={product._id || `product-${index}`} className="product-card">
                  {product.image && <img src={product.image} alt={product.name || "Product"} className="product-image" />}
                  <h3>{product.name || "Unnamed Product"}</h3>
                  <p className="product-price">Rs.{product.price ? product.price.toFixed(2) : "N/A"}</p>
                  <p className="product-description">{product.description || "No description available."}</p>
                  <button onClick={() => handleAddToCart(product)}>Add to Cart 🛒</button>
                </div>
              ))
            ) : (
              <p className="no-products">No {selectedCategory} products available.</p>
            )}
          </div>
        )}
      </section>

      {/*Footer */}
      <footer className="footer">
        <p>&copy; 2025 Flipkart Clone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;


