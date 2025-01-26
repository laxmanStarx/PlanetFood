import { useNavigate } from "react-router-dom";
import { useCart } from "../contextApi/CartContext";
import { useState, useEffect } from "react";

// Define the User type
interface User {
  name: string;
  email: string;
  // Add any other properties if needed
}

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Type the state as User or null

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set user details
    }
  }, []);

  const handleToggleCart = () => {
    setShowCart(!showCart);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove token if stored
    setUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  const checkout = () => {
    navigate("/checkout");
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <nav className="flex items-center justify-between bg-orange-400 min-h-16 px-4">
      <div className="text-3xl">

        <button onClick={() => navigate("/")}>foodStarX</button>

      </div>
      <div className="flex items-center space-x-4">
        <span onClick={() => navigate("/about")}>About Us</span>
        <div className="relative">
          <button onClick={handleToggleCart} className="flex items-center space-x-2">
            Cart ({calculateTotalItems()})
          </button>
          {showCart && (
            <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg p-4 z-50">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                cartItems.map((cartItem) =>
                  cartItem?.menuId ? (
                    <div key={cartItem.menuId} className="flex items-center space-x-4 mb-4">
                      <img
                        src={cartItem.image || ""}
                        alt={cartItem.name || "Item"}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-bold">{cartItem.name}</p>
                        <p className="text-gray-600 text-sm">
                          {cartItem.quantity} x Rs{cartItem.price?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                  ) : null
                )
              )}
              <button onClick={checkout}>Submit</button>
            </div>
          )}
        </div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="font-bold"> {user.name}!</span>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
