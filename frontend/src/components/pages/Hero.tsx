import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const carouselImages = [
    "https://res.cloudinary.com/dykahal7o/image/upload/v1767613689/Screenshot_2026-01-05_171757_jyckmx.png",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1765908609/Screenshot_2025-12-16_233844_n8gljm.png",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1737802470/rasgulla_uoquhz.jpg",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1767613447/Screenshot_2026-01-05_171353_nhj5wj.png",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1753452625/112315676_y1myor.jpg",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg"
  ];

  const [current, setCurrent] = useState(0);
  const duration = 4000;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, duration);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full font-serif">
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center cursor-pointer justify-between px-8 md:px-20 py-20 overflow-hidden bg-[#0a0a0a]">
        
        {/* Background Layer with Soft Floral Blur */}
        <div className="absolute inset-0 z-0">
          <img
            src={carouselImages[current]}
            alt="Background"
            className="w-full h-full object-cover opacity-30 blur-sm transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>

        {/* Left Content: Typography & Flare */}
        <div className="relative z-10 w-full md:w-3/5 space-y-8 text-center md:text-left cursor-pointer">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-400 text-xs uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Fine Dining Experience
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] text-white">
            Cultivating <span className="text-orange-500 italic">Flavor</span>, <br />
            Harvesting <span className="text-orange-500">Joy.</span>
          </h1>
          
          <p className="max-w-lg text-gray-300 text-lg font-light leading-relaxed font-sans">
            Where culinary craftsmanship meets nature's finest ingredients. 
            Discover a menu designed to bloom on your palate.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4 font-sans cursor-pointer">
            <button className="group relative px-8 py-4 bg-orange-500 text-white font-bold rounded-full overflow-hidden transition-all hover:pr-12">
              <span className="relative z-10"> <Link to="/Diningout">Explore Menu</Link></span>
              <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all">→</span>
            </button>

          </div>
        </div>

        {/* Right Content: The "Flower" Frame */}
        <div className="relative z-10 w-full md:w-2/5 flex justify-center items-center mt-12 md:mt-0">
          {/* Rotating Decorative Border */}
          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] border-t-2 border-b-2 border-orange-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] border-l-2 border-r-2 border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* Main Image in Petal-like Frame */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] overflow-hidden rounded-[40%_60%_70%_30%/40%_50%_60%_40%] border-8 border-white/10 shadow-2xl transition-all duration-1000 transform hover:scale-105">
            <img
              src={carouselImages[current]}
              alt="Culinary Dish"
              className="w-full h-full object-cover scale-110"
            />
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl hidden sm:block rotate-12">
            <p className="text-black text-xs font-bold uppercase tracking-tighter">Freshly Picked</p>
            <p className="text-orange-600 text-xl font-serif">100% Organic</p>
          </div>
        </div>

        {/* Bottom Progress Bars: "The Roots" */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3 w-[60%] max-w-md cursor-pointer">
          {carouselImages.map((_, index) => (
            <div
              key={index}
              className="relative h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
              onClick={() => setCurrent(index)}
            >
              {index === current && (
                <div
                  className="absolute top-0 left-0 h-full bg-orange-500"
                  style={{
                    animation: `fill ${duration}ms linear forwards`,
                  }}
                />
              )}
              {index < current && (
                <div className="absolute top-0 left-0 h-full bg-orange-400/50 w-full" />
              )}
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}