import { useState, useEffect } from "react";

export default function Hero() {
  const carouselImages = [
    "https://res.cloudinary.com/dykahal7o/image/upload/v1753633505/Screenshot_2025-07-27_215345_ft1z5v.png",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1753548026/Screenshot_2025-07-26_221011_avpfas.png",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1737802470/rasgulla_uoquhz.jpg",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1767104329/Screenshot_2025-12-30_194835_tfssfv.png",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1753452625/112315676_y1myor.jpg",
    "https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg"
  ];

  const [current, setCurrent] = useState(0);
  const duration = 4000; // 4 seconds per slide

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, duration);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[100vh] flex shadow-md shadow-slate-200 flex-col md:flex-row items-center cursor-pointer justify-between px-6 md:px-16 py-10 bg-gradient-to-r from-black/60 via-black/30 to-transparent text-white overflow-hidden">
        
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <img
            src={carouselImages[current]}
            alt="Food Banner"
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Progress Bars */}
        {/* <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 w-[80%] max-w-xl">
          {carouselImages.map((_, index) => (
            <div
              key={index}
              className="relative h-2 flex-1 bg-gray-400 rounded overflow-hidden"
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
                <div className="absolute top-0 left-0 h-full bg-orange-500 w-full" />
              )}
            </div>
          ))}
        </div> */}

        {/* Left Content */}
        <div className="relative z-10 w-full md:w-1/2 space-y-6 text-center md:text-left">
          <p className="uppercase tracking-wider text-sm text-gray-200">
            Welcome to our restaurant
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Delightful Dining <br /> Nourishing Nutrients <br /> & Delicious Food.
          </h1>
          {/*  */}

          {/* Buttons */}
          {/* <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition">
              Order Now
            </button>
            <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
              Reservation
            </button>
          </div> */}
        </div>



        {/* Right Image */}
        <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
          <img
            src={carouselImages[current]}
            alt="Food"
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-cover rounded-full drop-shadow-2xl border-4 border-white"
          />
        </div>


                {/* Progress Bars */}
        {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 w-[80%]  max-w-xl">
          {carouselImages.map((_, index) => (
            <div
              key={index}
              className="relative h-2 flex-1 bg-gray-400 rounded overflow-hidden"
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
                <div className="absolute top-0 left-0 h-full bg-orange-500 w-full" />
              )}
            </div>
          ))}
        </div> */}











      </section>
      

      {/* CSS for progress animation */}
      <style>{`
        @keyframes fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}






























  // const topPicks = [
  //   { id: 1, img: "https://res.cloudinary.com/dykahal7o/image/upload/v1753452625/112315676_y1myor.jpg", name: "Pizza" },
  //   { id: 2, img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f", name: "Burger" },
  //   { id: 3, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", name: "Pasta" },
  //   { id: 4, img: "https://images.unsplash.com/photo-1521305916504-4a1121188589", name: "Salad" },
  // ];