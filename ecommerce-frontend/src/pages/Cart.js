// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
// import { removeFromCart } from "../redux/cartSlice";
// import "./Cart.css";

// const Cart = () => {
//   const cartItems = useSelector((state) => state.cart.cartItems);
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // ✅ Initialize navigation

//   const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   // ✅ Handle Checkout Button Click
//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty! Add items before checkout.");
//       return;
//     }
//     navigate("/checkout"); // ✅ Navigate to checkout page
//   };

//   return (
//     <div className="cart-container">
//       <h2>Shopping Cart 🛒</h2>
//       {cartItems.length > 0 ? (
//         <>
//           {cartItems.map((item) => (
//             <div key={item._id} className="cart-item">
//               <img src={item.image || "/placeholder.png"} alt={item.name} className="cart-item-image" />
//               <div className="cart-item-details">
//                 <h3>{item.name}</h3>
//                 <p>Rs{item.price.toFixed(2)} x {item.quantity}</p>
//               </div>
//               <button className="remove-btn" onClick={() => dispatch(removeFromCart(item._id))}>
//                 Remove ❌
//               </button>
//             </div>
//           ))}
//           <div className="cart-summary">
//             <h3>Total: Rs{totalPrice.toFixed(2)}</h3>
//             <button className="checkout-btn" onClick={handleCheckout}>
//               Proceed to Checkout
//             </button>
//           </div>
//         </>
//       ) : (
//         <p className="empty-cart-message">Your cart is empty 😞</p>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { removeFromCart } from "../redux/cartSlice";
import "./Cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before checkout.");
      return;
    }
    navigate("/checkout"); 
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart 🛒</h2>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image || "/placeholder.png"} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Rs{(item.price || 0).toFixed(2)} x {item.quantity || 1}</p>
              </div>
              <button className="remove-btn" onClick={() => dispatch(removeFromCart(item._id))}>
                Remove ❌
              </button>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: Rs{totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="empty-cart-message">Your cart is empty 😞</p>
      )}
    </div>
  );
};

export default Cart;

