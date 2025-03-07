import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// Load cart from localStorage
const loadCartState = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : { cartItems: [] };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { cartItems: [] };
  }
};

// Save cart to localStorage on state change
const saveCartState = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: { cart: loadCartState() },
});

store.subscribe(() => saveCartState(store.getState()));

export default store;

