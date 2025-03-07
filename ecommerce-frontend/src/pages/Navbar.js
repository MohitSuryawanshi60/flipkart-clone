import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <Link to="/home" style={linkStyle}>Home</Link>
      <Link to="/products" style={linkStyle}>Products</Link>
      <Link to="/cart" style={linkStyle}>Cart</Link>
      {token ? (
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      ) : (
        <Link to="/login" style={linkStyle}>Login</Link>
      )}
    </nav>
  );
};

const navStyle = { display: "flex", gap: "15px", padding: "10px", background: "#333", color: "white" };
const linkStyle = { color: "white", textDecoration: "none" };
const logoutButtonStyle = { backgroundColor: "red", color: "white", border: "none", cursor: "pointer" };

export default Navbar;
