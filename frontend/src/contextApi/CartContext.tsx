import React, { createContext, useContext, useEffect, useState } from "react";

interface MenuItem {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
}

interface CartItem {
  menuId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  restaurantId?: string;
}




interface CartContextType {
  cartItems: CartItem[];
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  addToCart: (menuId: string, name: string, image: string, price: number, quantity: number) => void;
  // addToCart: (menuId: string, quantity: number) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  updateCart:(menuId: string, change: number)=>void
  removeFromCart:(menuId: string)=>void
  clearCart:()=>void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from local storage
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(()=>{
    const storedMenuItems = localStorage.getItem("menuItems");
    return storedMenuItems ? JSON.parse(storedMenuItems) : [];
  })


  useEffect(() => {
    // Save cart to local storage whenever it changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);


  // // Persist menuItems to localStorage
  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);







  // const addToCart = (menuId: string, quantity: number) => {
  //   setCartItems((prev) => {
  //     const existingItem = prev.find((item) => item.menuId === menuId);
  //     if (existingItem) {
  //       return prev.map((item) =>
  //         item.menuId === menuId
  //           ? { ...item, quantity: item.quantity + quantity }
  //           : item
  //       );
        
  //     }
  //     return [...prev, { menuId, quantity:1 }];
    
  //   });
    
  // };






  const addToCart = (
    menuId: string,
    name: string,
    image: string,
    price: number,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.menuId === menuId);
      if (existingItem) {
        return prev.map((item) =>
          item.menuId === menuId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { menuId, name, image, price, quantity }];
    });
  };
  
  
  
  









  const updateCart = (menuId: string, change: number) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.menuId === menuId
          ? { ...cartItem, quantity: Math.max(1, cartItem.quantity + change) }
          : cartItem
      )
    );
  };
  


   const updateQuantity = (menuId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuId === menuId ? { ...item, quantity } : item
      ).filter((item) => item.quantity > 0)
    );
  };




  const clearCart = () => {
    setCartItems([]); // Reset cartItems to an empty array
    localStorage.removeItem("cartItems"); // Remove cart data from localStorage
  };
  



// In CartContext.tsx or wherever your context is defined
const removeFromCart = (menuId: string) => {
  setCartItems((prevItems) => prevItems.filter((item) => item.menuId !== menuId));
};






  return (
    <CartContext.Provider
      value={{ cartItems, menuItems, setMenuItems, addToCart,updateCart,clearCart, updateQuantity,removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}; 