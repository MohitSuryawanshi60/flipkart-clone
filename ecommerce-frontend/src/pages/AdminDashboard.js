import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { BarChart, ShoppingCart, Users, Settings, LogOut } from "lucide-react";
import "./style.css"; // Ensure styles are applied

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    navigate("/admin-login");
  };

  if (!isAdmin) return null; // Prevents rendering if not an admin

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("#")}>
              <Users size={20} /> Users
            </li>
            <li onClick={() => navigate("/adminorders")}>
                <ShoppingCart size={20} /> Orders
            </li>

            <li onClick={() => navigate("/productadd")}>
              <BarChart size={20} /> Add Product
            </li>
            <li onClick={() => navigate("/products")}>
              <BarChart size={20} /> Products
            </li>
            <li onClick={() => navigate("#")}>
              <Settings size={20} /> Settings
            </li>
          </ul>
        </nav>
        <li onClick={handleLogout} className="logout-item">
              <LogOut size={20} /> Logout
            </li>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h1>Admin Dashboard</h1>

        {/* Dashboard Metrics */}
        <div className="dashboard-cards">
          <Card className="card">
            <CardContent>
              <h3>Total Users</h3>
              <p>1,234</p>
            </CardContent>
          </Card>
          <Card className="card">
            <CardContent>
              <h3>Total Orders</h3>
              <p>567</p>
            </CardContent>
          </Card>
          <Card className="card">
            <CardContent>
              <h3>Total Revenue</h3>
              <p>RS.45,678</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
