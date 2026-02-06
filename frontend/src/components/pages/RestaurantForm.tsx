import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantForm: React.FC = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(restaurant),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add restaurant");
      }

      setRestaurant({ name: "", address: "", image: "" });
      alert("Success! Your restaurant is now live.");
    } catch (error: any) {
      alert(error.message || "Failed to add restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 cursor-pointer">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Brand Panel */}
        <div className="md:w-1/3 bg-black p-10 flex flex-col justify-between text-white cursor-pointer">
          <div>
            <div className="w-12 h-12 bg-white rounded-2xl mb-8 flex items-center justify-center">
              <span className="text-black text-2xl font-black">R</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">
              Partner <br />With Us.
            </h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed cursor-pointer">
              Join thousands of restaurants already growing their business with our platform.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/add-menu")}
              className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
            >
              Skip to Food Form
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="md:w-2/3 p-10 md:p-16">
          <header className="mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Registration</h2>
            <h3 className="text-3xl font-bold text-gray-900">Restaurant Details</h3>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-800 uppercase tracking-wide">Restaurant Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="The Golden Plate"
                  value={restaurant.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-b-2 border-gray-200 py-3 px-1 outline-none focus:border-black transition-all duration-300 placeholder:text-gray-300"
                  required
                />
              </div>

              {/* Image URL Input */}
              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-800 uppercase tracking-wide">Brand Image URL</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://images.com/logo.jpg"
                  value={restaurant.image}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-b-2 border-gray-200 py-3 px-1 outline-none focus:border-black transition-all duration-300 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-800 uppercase tracking-wide">Physical Address</label>
              <input
                type="text"
                name="address"
                placeholder="123 Culinary St, Food City"
                value={restaurant.address}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-b-2 border-gray-200 py-3 px-1 outline-none focus:border-black transition-all duration-300 placeholder:text-gray-300"
                required
              />
            </div>

            {/* Live Preview Section */}
            {restaurant.image && (
              <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Banner Preview</p>
                <div className="w-full h-32 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={restaurant.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all disabled:bg-gray-400"
            >
              {loading ? "Registering..." : "Onboard Restaurant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantForm;