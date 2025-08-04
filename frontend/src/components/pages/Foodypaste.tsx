import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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


  const date = new Date();
  const time = date.getHours();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendUrl}/foodRoute`)
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

  const navigate = useNavigate()

  // Filtered menu based on selectedCategory
  const filteredMenu = selectedCategory === "All"
    ? menu
    : menu.filter(item => item.category === selectedCategory);

  
  
  
    return (




    <div className="p-6 justify-center items-center text-center">
      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center items-center">

        {categories.map((category) => (
    category === "Non Veg" ? (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-full border transition ${
        selectedCategory === category
          ? "bg-red-600 text-white" 
          : "bg-white text-gray-800 border-gray-300  hover:bg-green-100"
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
      <div className="flex justify-center items-center">
 <div className=" lg:max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  ">
        {filteredMenu.map((item) => (
         <div
  key={item.id}
  onClick={() => navigate(`/category/${encodeURIComponent(item.category)}`)}
  className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border group"
>
  {/* Image section */}
  <div className="relative">
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-48 object-cover"
    />

    {/* Optional: promo badge */}
    <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
      Promoted
    </span>

    {/* Optional: offer badge */}
    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
      Flat 10% OFF
    </span>
  </div>

  {/* Text section */}
  <div className="p-4 text-left">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>

      {/* Rating badge */}
      {/* <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-md font-medium">
        4.2★
      </span> */}
    </div>

    {/* Description and category */}
    <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>

    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
      <span>₹{item.price} for one</span>
      <span>{item.category}</span>
    </div>

    {/* Optional: status or distance */}
    { time <= 23 && time >= 12 ? ( <p className="text-sm text-green-600 mt-1">Opened </p>):  <p className="text-sm text-red-600 mt-1">Opens after 12pm </p> }
  
    {/* <p className="text-sm text-red-600 mt-1">Opens tomorrow at 12noon</p> */}

  </div>
</div>
        ))}
        </div>
        </div>
        </div>

  );
};

export default Foodypaste;
