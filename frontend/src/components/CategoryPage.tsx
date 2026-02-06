import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../contextApi/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const { cartItems, addToCart, updateQuantity } = useCart();

  const categoryImages: { [key: string]: string } = {
    Pizza: "https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg",
    NonVeg: "https://res.cloudinary.com/dykahal7o/image/upload/v1753548026/Screenshot_2025-07-26_221011_avpfas.png",
    Veg: "https://res.cloudinary.com/dykahal7o/image/upload/v1753728673/Screenshot_2025-07-29_002104_cfgebm.png",
    Cake: "https://res.cloudinary.com/dykahal7o/image/upload/v1767104329/Screenshot_2025-12-30_194835_tfssfv.png",
    Juice: "https://res.cloudinary.com/dykahal7o/image/upload/v1765908609/Screenshot_2025-12-16_233844_n8gljm.png",
    Dessert: "https://res.cloudinary.com/dykahal7o/image/upload/v1753452625/112315676_y1myor.jpg"
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backendUrl}/foodRoute`).then((res) => {
      const filtered = res.data.filter(
        (item: any) => item.category === categoryName
      );
      setItems(filtered);
    });
  }, [categoryName]);

  const handleAddToCart = (id: string, name: string, image: string, price: number) => {
    addToCart(id, name, image, price, 1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* 1. HERO BANNER SECTION */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img
          src={categoryImages[categoryName || ""] || categoryImages["NonVeg"]}
          alt="Banner"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-black/40 to-black/60" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-12 text-white">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-6 md:left-16 bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white hover:text-black transition-all"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          
          <span className="bg-orange-500 w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            {categoryName} <span className="text-orange-500">.</span>
          </h1>
          <p className="max-w-xl text-lg text-white/80 font-medium leading-relaxed italic">
            "Discover the finest selection of {categoryName} dishes, curated for the ultimate foodie experience."
          </p>
        </div>
      </div>

      {/* 2. ITEMS GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {items.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm">
            <p className="text-gray-400 font-bold text-xl">Cooking up something new! Stay tuned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item: any) => {
              const cartItem = cartItems.find((c) => c.menuId === item.id);
              const quantity = cartItem?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 border border-gray-100/50"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-2xl flex items-center gap-1 shadow-sm">
                      <FontAwesomeIcon icon={faStar} className="text-orange-500 text-[10px]" />
                      <span className="text-[11px] font-black text-gray-800">4.2</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-medium mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-gray-900 italic">
                        ₹{item.price}
                      </span>

                      {/* Add/Quantity Control */}
                      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl">
                        {quantity === 0 ? (
                          <button
                            onClick={() => handleAddToCart(item.id, item.name, item.image, item.price)}
                            className="bg-black text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all active:scale-95"
                          >
                            Add
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                            >
                              <FontAwesomeIcon icon={faMinus} size="sm" />
                            </button>
                            <span className="font-black text-sm w-4 text-center">{quantity}</span>
                            <button
                              onClick={() => handleAddToCart(item.id, item.name, item.image, item.price)}
                              className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg shadow-sm hover:bg-gray-800 transition-colors"
                            >
                              <FontAwesomeIcon icon={faPlus} size="sm" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;