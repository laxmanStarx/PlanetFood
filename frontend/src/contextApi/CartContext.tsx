import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface CartItem {
  menuId: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (menuId: string, quantity: number) => void;
  removeFromCart: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load the cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));  // Parse and set the saved cart items
    }
  }, []);

  // Save the cart to localStorage whenever the cartItems state changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (menuId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.menuId === menuId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.menuId === menuId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { menuId, quantity }];
      }
    });
  };

  const removeFromCart = (menuId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.menuId !== menuId));
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.menuId === menuId
          ? { ...item, quantity: Math.max(quantity, 0) } // Ensure quantity doesn't go negative
          : item
      ).filter((item) => item.quantity > 0);  // Remove items with quantity <= 0
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");  // Optionally remove from localStorage when clearing the cart
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
