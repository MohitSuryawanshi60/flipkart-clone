import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trash, CheckCircle } from "lucide-react";
import "./AdminOrders.css"; // Ensure CSS file is present

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Orders Function
  const fetchOrders = useCallback(async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      alert("Unauthorized access. Redirecting to admin login.");
      navigate("/admin-login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://flipkart-cloneb.vercel.app/api/orders", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Confirm Order (Change "Pending" to "Completed")
  const confirmOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!response.ok) throw new Error("Failed to confirm order");

      // Update UI instantly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Completed" } : order
        )
      );
      alert("Order marked as Completed!");
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order.");
    }
  };

  // Delete Order
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      if (!response.ok) throw new Error("Failed to delete order");

      // Remove from UI instantly
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="admin-orders">
      <h1>Order List</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Products</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.fullName || "Unknown"}</td>
                  <td>{order.address}</td>
                  <td>{order.phone}</td>
                  <td>
                    {order.cartItems?.map((item) => (
                      <div key={item._id} className="order-product">
                        <strong>{item.name}</strong> - Rs.{item.price.toFixed(2)} x {item.quantity}
                      </div>
                    )) || "No products"}
                  </td>
                  <td>
                    Rs.
                    {order.cartItems
                      ?.reduce((total, item) => total + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status !== "Completed" && (
                      <button onClick={() => confirmOrder(order._id)} className="confirm-btn">
                        <CheckCircle size={20} /> Confirm
                      </button>
                    )}
                    <button onClick={() => deleteOrder(order._id)} className="delete-btn">
                      <Trash size={20} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;


