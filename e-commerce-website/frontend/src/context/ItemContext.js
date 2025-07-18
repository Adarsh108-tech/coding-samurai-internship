"use client";
import { createContext, useContext, useState } from "react";

const ItemContext = createContext();

export function ItemProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const clearCartFromContext = () => {
    setCartItems([]);
  };

  return (
    <ItemContext.Provider
      value={{ cartItems, addToCart, clearCartFromContext, user, setUser }}
    >
      {children}
    </ItemContext.Provider>
  );
}

export const useItemContext = () => useContext(ItemContext);
