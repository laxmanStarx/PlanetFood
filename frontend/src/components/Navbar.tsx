import {  useNavigate } from "react-router-dom";
import { useCart } from "../contextApi/CartContext";
import { useState, useEffect } from "react";
import { IoBagAddOutline } from "react-icons/io5";
// import { FiMenu, FiX } from "react-icons/fi";

import RateUs from "./RateUs";

interface User {
  name: string;
  email: string;
  role?: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { cartItems = [], clearCart } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearCart();
    setUser(null);
    navigate("/login");
  };

  const checkout = () => navigate("/checkout");

  const calculateTotalItems = () =>
    cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

return (
  <nav className="bg-white shadow-md px-4 py-3">
{/* Logo */}
<div 
  className="text-2xl font-bold cursor-pointer flex items-center gap-2" 
  onClick={() => navigate("/")}
>
  <span>FlavorDash</span>
  <img 
    src="https://res.cloudinary.com/dykahal7o/image/upload/v1770278680/Screenshot_2026-02-05_133310_qcner9.png" 
    alt="logo"
    className="h-8 w-auto object-contain rounded-sm" 
  />
</div>

    {/* Mobile Dropdown Menu */}
    {showMenu && (
      <div className="lg:hidden mt-3 space-y-2">
        <button onClick={() => { navigate("/aboutus"); setShowMenu(false); }} className="block w-full text-left px-2 py-1">
          About Us
        </button>
        <button onClick={() => { setShowRateUs(true); setShowMenu(false); }} className="block w-full text-left px-2 py-1">
          Rate Us
        </button>
        <button onClick={() => { navigate("/Diningout"); setShowMenu(false); }} className="block w-full text-left px-2 py-1">
          Diningout
        </button>

        {/* Admin notifications link (mobile) */}
        {user?.role === "admin" && (
          <button
            onClick={() => { navigate("/admin/notifications"); setShowMenu(false); }}
            className="block w-full text-left px-2 py-1 bg-blue-50 text-blue-600 font-semibold rounded"
          >
            Notifications
          </button>
        )}

        <button
          onClick={() => setShowCart(!showCart)}
          className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full w-full justify-center"
        >
          <IoBagAddOutline />
          <span>{calculateTotalItems()}</span>
        </button>
        
        {showCart && (
          <div className="mt-2 w-full bg-white border shadow-lg rounded-lg p-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Cart is empty</p>
            ) : (
              cartItems.map(cartItem => (
                <div key={cartItem.menuId} className="flex items-center space-x-4 mb-4">
                  <img src={cartItem.image || ""} alt={cartItem.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-bold">{cartItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {cartItem.quantity} x ₹{cartItem.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <button onClick={checkout} className="bg-blue-500 text-white px-3 py-1 rounded mt-2 w-full">
              Submit
            </button>
          </div>
        )}

        {user ? (
          <>
            <span className="block px-2 py-1 font-semibold text-black">{user.name}</span>
            <button onClick={handleLogout} className="block w-full text-center px-2 py-1 bg-red-400 text-white rounded-md">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => { navigate("/login"); setShowMenu(false); }} className="block w-full text-center px-2 py-1 bg-blue-500 text-white rounded">
            Login
          </button>
        )}
      </div>
    )}

    {/* Rate Us Modal */}
    {showRateUs && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <button onClick={() => setShowRateUs(false)} className="absolute top-2 right-2 text-red-600 font-bold">
            ✕
          </button>
          <RateUs onClose={() => setShowRateUs(false)} />
        </div>
      </div>
    )}
  </nav>
);
};

export default Navbar; 





