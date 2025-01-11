import React, { useEffect, useState } from "react";
import { useCart } from "../contextApi/CartContext";

import { FaTrash } from "react-icons/fa";

const Checkout: React.FC = () => {
  const { cartItems, clearCart, updateCart,removeFromCart } = useCart();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState<string | null>(null); // To handle errors

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:8080/foodRoute");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchMenuItems();
  }, []);

  const handleIncrement = (menuId: string) => {
    updateCart(menuId, 1);
  };

  const handleDecrement = (menuId: string) => {
    updateCart(menuId, -1);
  };

  const calculateTotalPrice = (): number => {
    return cartItems.reduce((total, cartItem) => {
      const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
      return item ? total + cartItem.quantity * item.price : total;
    }, 0);
  };

 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-8">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div  className="w-full md:w-3/4 lg:w-2/3 mx-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Image</th>
                <th className="border border-gray-200 p-2">Name</th>
                
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const menuItem = menuItems.find(
                  (menu) => menu.id === item.menuId
                );
                return (
                  <tr key={item.menuId}>
                    <td className="border border-gray-200 p-2 items-start justify-center">
                      {menuItem && (
                        <img
                          src={menuItem.image}
                          className="w-16 h-16 object-cover rounded-lg items-center justify-center text-center"
                          alt={menuItem.name}
                        />
                      )}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {menuItem ? menuItem.name : "Unknown"}
                    </td>
                    <td className="border border-gray-200 p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDecrement(item.menuId)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-lg">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.menuId)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="border px-4 py-2">
                      Rs
                      {menuItem
                        ? (menuItem.price * item.quantity).toFixed(2)
                        : "0.00"}
                        <FaTrash onClick={() => removeFromCart(item.menuId)}
                        className="bg-red-500 text-white px-2 py-1 rounded" />
                        
                       
                    </td>
                    {/* <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => removeFromCart(item.menuId)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={3}
                  className="border border-gray-200 p-2 text-right font-bold"
                >
                  Total Price
                </td>
                <td className="border border-gray-200 p-2 text-right font-bold">
                  Rs{calculateTotalPrice().toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
