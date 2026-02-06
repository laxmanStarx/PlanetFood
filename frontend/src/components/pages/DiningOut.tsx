// import RestaurantMenu from "../RestaurantMenu"
// import Foodypaste from "./Foodypaste"


// const DiningOut = () => {
//   return (
//     <>
//     <div className="relative">
//         <Foodypaste />
//     </div>
//     <div>
//             <RestaurantMenu />
//     </div>
//     </>
//   )
// }

// export default DiningOut






import { useRef } from "react";
import Foodypaste from "./Foodypaste";

export default function FoodInspiration() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = [
    { label: "Biryani", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1765471778/Screenshot_2025-12-11_221908_t8gddp.png", color: "from-orange-500/20" },
    { label: "Pizza", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg", color: "from-red-500/20" },
    { label: "Cake", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1737995138/cakke_ehnumt.jpg", color: "from-pink-500/20" },
    { label: "Rasgulla", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1737802470/rasgulla_uoquhz.jpg", color: "from-yellow-500/20" },
    { label: "Noodles", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1753547653/Screenshot_2025-07-26_220130_b9ur7q.png", color: "from-green-500/20" },
    { label: "Paneer", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1753728673/Screenshot_2025-07-29_002104_cfgebm.png", color: "from-blue-500/20" }
    
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full px-6 md:px-16 py-16 bg-[#fafafa]">
      {/* Header Section with Trending Tag */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-sm mb-4 inline-block">
            Trending Now
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Craving <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Something?</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Top picks based on your location and mood.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => scroll("left")}
            className="group w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-black transition-all duration-300"
          >
            <span className="group-hover:text-white transition-colors">←</span>
          </button>
          <button 
            onClick={() => scroll("right")}
            className="group w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-black transition-all duration-300 shadow-sm"
          >
            <span className="group-hover:text-white transition-colors">→</span>
          </button>
        </div>
      </div>

      {/* Modern Trending List */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-10 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div 
            key={item.label} 
            className="group flex flex-col items-center flex-shrink-0 snap-start"
          >
            {/* The Squircle Container */}
            <div className={`relative w-44 h-44 transition-all duration-500 ease-out transform group-hover:-translate-y-4`}>
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-b ${item.color} to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] transition-all duration-500">
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Glass Overlay on Hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors duration-300">
              {item.label}
            </p>
            
            {/* Animated Underline */}
            <div className="h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-8 mt-1" />
          </div>
        ))}
      </div>

      {/* Decorative Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16" />

      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
        <Foodypaste />
      </div>
    </div>
  );
}