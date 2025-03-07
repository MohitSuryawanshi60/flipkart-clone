import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Checkout.css";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (cartItems.length === 0) {
    return <h2>Your cart is empty. Add items before checkout!</h2>;
  }

  const handlePlaceOrder = async () => {
    if (!fullName || !address || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    const orderData = {
      fullName,
      address,
      phone,
      cartItems,
      paymentMethod,
    };

    try {
      const response = await fetch("https://flipkart-cloneb.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      alert("Order placed successfully!");
      window.location.href = "/home"; // Redirect to success page
    } catch (error) {
      console.error("Error:", error);
      alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <h4>{item.name}</h4>
            <p>Price: Rs{item.price.toFixed(2)}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label>Address</label>
        <textarea
          placeholder="Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></textarea>

        <label>Phone Number</label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              setPhone(value);
            }
          }}
          required
        />

        {/* Payment Method */}
        <h3>Payment Method</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Credit/Debit Card
          </label>
        </div>

        {/* Checkout Button */}
        <button type="button" className="checkout-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
