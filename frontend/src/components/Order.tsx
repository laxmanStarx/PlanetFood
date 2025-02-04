import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("import.meta.env.STRIPE_API"); // Fix ENV key
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID is missing.");
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/orders?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        console.log("Fetched Orders:", data);

        if (!Array.isArray(data)) throw new Error("Invalid response format");

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const handlePayment = async () => {
    const stripe = await stripePromise;
    try {
      const allItems = orders.flatMap((order) => order.orderItems ?? []);
      if (allItems.length === 0) {
        alert("No items available for payment.");
        return;
      }

      const response = await fetch(`${backendUrl}/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: allItems }),
      });

      const { url } = await response.json();
      if (stripe && url) {
        window.location.href = url; // Redirect to Stripe checkout
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-8">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Items</th>
                <th className="border p-2">Total Price</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">
                    <ul>
                      {(order.orderItems ?? []).map((item: any) => (
                        <li key={item.id}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2">
                    Rs{" "}
                    {(order.orderItems ?? []).reduce(
                      (total: number, item: any) => total + (item.price || 0) * (item.quantity || 1),
                      0
                    ).toFixed(2)}
                  </td>
                  <td className="border p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pay for All Orders Button */}
          {orders.length > 0 && (
            <div className="text-center mt-4">
              <button
                className="bg-green-500 text-white px-6 py-3 rounded"
                onClick={handlePayment}
              >
                Pay for All Orders
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
