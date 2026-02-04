import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  order: {
    id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    orderItems: {
      id: string;
      quantity: number;
      menu: {
        name: string;
        price: number;
      };
    }[];
  };
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    if (!token) {
      setError("You must be logged in as admin to view notifications.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${backendUrl}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/admin/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update notification");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n.id)));
  };

  if (!token) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-red-600">
          Please log in as an admin to view notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Mark all as read
        </button>
      </div>

      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {notifications.length === 0 && !loading ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border rounded-lg p-3 ${
                n.isRead ? "bg-white" : "bg-yellow-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {n.message}{" "}
                    {!n.isRead && (
                      <span className="text-xs text-red-600">(new)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    From: {n.user.name} ({n.user.email})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="ml-4 px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Mark as read
                  </button>
                )}
              </div>

              {/* Order summary */}
              {n.order && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Order ID:</span> {n.order.id}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {n.order.status}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> ₹
                    {n.order.totalPrice}
                  </p>
                  <div className="mt-1">
                    <span className="font-semibold">Items:</span>
                    <ul className="list-disc list-inside">
                      {n.order.orderItems.map((item) => (
                        <li key={item.id}>
                          {item.menu.name} &times; {item.quantity} (₹
                          {item.menu.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;

