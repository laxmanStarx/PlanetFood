import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contextApi/CartContext";
import { useState, useEffect } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import { FiMenu, FiX, FiBell, FiLogOut, } from "react-icons/fi";
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
  const [scrolled, setScrolled] = useState(false);

  const { cartItems = [], clearCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearCart();
    setUser(null);
    navigate("/login");
  };

  const calculateTotalItems = () =>
    cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 px-4 py-3 ${
      scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/40 p-2 rounded-2xl md:rounded-full px-6 border border-white/20">
        
        {/* Logo */}
        <div 
          className="text-2xl font-black italic tracking-tighter cursor-pointer text-gray-900 group" 
          onClick={() => navigate("/")}
        >
          Flavor<span className="text-orange-500 group-hover:text-black transition-colors">Dash</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 font-bold text-sm text-gray-600 uppercase tracking-widest">
          <span onClick={() => navigate("/aboutus")} className="hover:text-orange-500 cursor-pointer transition-colors">About</span>
          <button onClick={() => setShowRateUs(true)} className="hover:text-orange-500 transition-colors uppercase">Rate Us</button>
          <Link to="/Diningout" className="hover:text-orange-500 transition-colors">Dining</Link>
          
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/notifications")}
              className="flex items-center gap-1 text-blue-600 hover:scale-105 transition-transform"
            >
              <FiBell /> <span>Alerts</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Cart Dropdown Logic */}
          <div className="relative">
            <button 
              onClick={() => setShowCart(!showCart)} 
              className="relative flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-orange-500 transition-all shadow-xl active:scale-90"
            >
              <IoBagAddOutline size={20} />
              {calculateTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {calculateTotalItems()}
                </span>
              )}
            </button>

            {showCart && (
              <div className="absolute right-0 mt-4 w-72 bg-white border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5">
                <h3 className="text-lg font-black mb-4">Your Bag</h3>
                {cartItems.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">Nothing here yet...</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(item => (
                      <div key={item.menuId} className="flex items-center gap-3 mb-4 last:mb-0">
                        <img src={item.image || ""} alt={item.name} className="w-12 h-12 object-cover rounded-xl" />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-xs truncate uppercase tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold tracking-widest">
                            QTY: {item.quantity} • ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => { navigate("/checkout"); setShowCart(false); }} 
                  className="bg-black text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl mt-6 w-full hover:bg-orange-500 transition-all shadow-lg"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="hidden lg:flex items-center gap-3 border-l pl-4 border-gray-200">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-gray-400">Welcome</span>
                  <span className="text-xs font-bold text-gray-900 leading-none tracking-tight">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate("/login")} 
                className="bg-gray-100 text-gray-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
              >
                Login
              </button>
            )}
          </div>

  



          {/* Mobile Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="lg:hidden absolute top-20 left-4 right-4 bg-white rounded-[2rem] shadow-2xl p-8 space-y-6 border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col space-y-4 font-black uppercase tracking-[0.2em] text-sm">
            <Link to="/aboutus" onClick={() => setShowMenu(false)}>About Us</Link>
            <button onClick={() => { setShowRateUs(true); setShowMenu(false); }} className="text-left">Rate Us</button>
            <Link to="/Diningout" onClick={() => setShowMenu(false)}>Dining Out</Link>
            {user?.role === "admin" && (
              <Link to="/admin/notifications" className="text-blue-600">Admin Alerts</Link>
            )}
          </div>
          
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black italic">
                    {user.name[0]}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-red-500 text-xs font-black uppercase tracking-widest">Logout</button>
              </>
            ) : (
              <button onClick={() => { navigate("/login"); setShowMenu(false); }} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest">Login</button>
            )}
          </div>
        </div>
      )}

      {/* Rate Us Modal - Keeping your logic but updating style */}
      {showRateUs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[200]">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-[90%] p-10 relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowRateUs(false)} className="absolute top-6 right-8 text-gray-300 hover:text-red-500 transition-colors">
              <FiX size={24}/>
            </button>
            <RateUs onClose={() => setShowRateUs(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;