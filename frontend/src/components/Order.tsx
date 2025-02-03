import React, { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  menu: {
    name: string;
    image: string;
    price: number;
  };
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backendUrl}/foodRoute/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
  
        const data = await response.json();
        console.log("Fetched orders:", data); // Debugging line
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [backendUrl]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="mb-4">
              <p className="font-bold">Total Price: Rs {order.totalPrice.toFixed(2)}</p>
              <p className="text-gray-600">Status: {order.status}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Items:</h3>
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 mb-2">
                  <img
                    src={item.menu.image}
                    alt={item.menu.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.menu.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: Rs {item.menu.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;










// import React, { useEffect, useState } from "react";
// import { useCart } from "../contextApi/CartContext";
// import { FaTrash } from "react-icons/fa";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("pk_test_51QfoSFKYglU8W7YCY1minmNmAaoNvVe7CjZ7KT94Lwj6InGq84HxIRQgdOvpBo6bZSrHYm6YVjkav83mc5pQc6Rd00a1n9pjVj");

// const backendUrl = import.meta.env.VITE_BACKEND_URL;


// const OrderPage: React.FC = () => {
//   const { cartItems, clearCart, updateCart, removeFromCart } = useCart();
//   const [menuItems, setMenuItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/foodRoute`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch menu items");
//         }
//         const data = await response.json();
//         setMenuItems(data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load menu items. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMenuItems();
//   }, []);

//   const calculateTotalPrice = (): number => {
//     return cartItems.reduce((total, cartItem) => {
//       const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
//       return item ? total + cartItem.quantity * item.price : total;
//     }, 0);
//   };

//   const handleCheckout = async () => {
//     const stripe = await stripePromise;

//     const items = cartItems.map((cartItem) => {
//       const menuItem = menuItems.find((menu) => menu.id === cartItem.menuId);
//       if (!menuItem) {
//         console.error("Menu item not found for cart item:", cartItem.menuId);
//         return null;
//       }
//       return {
//         name: menuItem.name,
//         price: Math.round(menuItem.price * 100), // Convert to cents
//         quantity: cartItem.quantity,
//       };
//     }).filter(Boolean); // Remove null items
//     const userId = localStorage.getItem("userId");
    
//     try {
//       const response = await fetch(`${backendUrl}/payment/create-checkout-session`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ items, userId }),
//       });

//       const { url } = await response.json();
//       if (stripe && url) {
//         window.location.href = url;
//       }
//     } catch (err) {
//       console.error("Error redirecting to Stripe Checkout", err);
//       alert("Failed to initiate payment. Please try again.");
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl text-center font-bold mb-8">Checkout</h1>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
//           <table className="w-full border-collapse border border-gray-200">
//             <thead>
//               <tr>
//                 <th className="border border-gray-200 p-2">Image</th>
//                 <th className="border border-gray-200 p-2">Name</th>
//                 <th className="border px-4 py-2">Quantity</th>
//                 <th className="border px-4 py-2">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item) => {
//                 const menuItem = menuItems.find(
//                   (menu) => menu.id === item.menuId
//                 );
//                 return (
//                   <tr key={item.menuId}>
//                     <td className="border border-gray-200 p-2">
//                       {menuItem && (
//                         <img
//                           src={menuItem.image}
//                           className="w-16 h-16 object-cover rounded-lg"
//                           alt={menuItem.name}
//                         />
//                       )}
//                     </td>
//                     <td className="border border-gray-200 p-2">
//                       {menuItem ? menuItem.name : "Unknown"}
//                     </td>
//                     <td className="border border-gray-200 p-2 text-center">
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           onClick={() => updateCart(item.menuId, -1)}
//                           className="bg-red-500 text-white px-2 py-1 rounded"
//                           disabled={item.quantity <= 1}
//                         >
//                           -
//                         </button>
//                         <span className="text-lg">{item.quantity}</span>
//                         <button
//                           onClick={() => updateCart(item.menuId, 1)}
//                           className="bg-green-500 text-white px-2 py-1 rounded"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </td>
//                     <td className="border px-4 py-2">
//                       Rs
//                       {menuItem
//                         ? (menuItem.price * item.quantity).toFixed(2)
//                         : "0.00"}
//                       <FaTrash
//                         onClick={() => removeFromCart(item.menuId)}
//                         className="ml-2 text-red-500 cursor-pointer"
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td
//                   colSpan={3}
//                   className="border border-gray-200 p-2 text-right font-bold"
//                 >
//                   Total Price
//                 </td>
//                 <td className="border border-gray-200 p-2 text-right font-bold">
//                   Rs{calculateTotalPrice().toFixed(2)}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//           <button
//             className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
//             onClick={handleCheckout}
//           >
//             Pay Now
//           </button>
//           <button
//             className="mt-4 bg-red-500 text-white px-4 py-2 rounded ml-2"
//             onClick={clearCart}
//           >
//             Clear Cart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderPage;






