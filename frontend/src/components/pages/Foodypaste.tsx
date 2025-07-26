import { useEffect, useState } from "react";
import axios from "axios";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  category: string;
}

const Foodypaste = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    axios.get(`{process.env.VITE_BACKEND_URL}/foodRoute`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMenu(res.data);
        } else {
          console.error("Unexpected data format:", res.data);
          setMenu([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load menu", err);
        setMenu([]);
      });
  }, []);

  // Get unique categories from menu
  const categories = ["All", ...Array.from(new Set(menu.map(item => item.category)))];

  // Filtered menu based on selectedCategory
  const filteredMenu = selectedCategory === "All"
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  return (
    <div className="p-6">
      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">

        {categories.map((category) => (
    category === "Non Veg" ? (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-full border transition ${
        selectedCategory === category
          ? "bg-red-600 text-white" 
          : "bg-white text-gray-800 border-gray-300  hover:bg-green-100 "
      } ` }
    >
      {category}
    </button>
  ) : (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-xl border transition ${
        selectedCategory === category
          ? "bg-green-600 text-white"
          : "bg-white text-gray-800 border-gray-300 hover:bg-green-100"
      }`}
    >
      {category}
    </button>
  ))
)}
      </div>

      {/* Menu Cards */}
      <div className=" lg:max-w-5xl   grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 cursor-pointer">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-200 to-transparent opacity-0 group-hover:opacity-60 transition duration-500 rounded-2xl pointer-events-none" />
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-green-600 font-bold">₹{item.price}</span>
                <span className="text-sm bg-gray-200 rounded px-2 py-1">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Foodypaste;
