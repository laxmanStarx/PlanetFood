export default function Hero() {
  return (
    <section className="bg-[#f8f8f8] w-full min-h-screen px-4 md:px-10 py-10 flex flex-col-reverse md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
        <p className="text-gray-600 uppercase tracking-wider text-sm">
          Welcome to our restaurant
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Delightful Dining <br />
          Nourishing Nutrients <br />
          and Delicious Food.
        </h1>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
          <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
            Order Now
          </button>
          <button className="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition">
            Reservation
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center items-center">
        <img
          src="https://res.cloudinary.com/dykahal7o/image/upload/v1753633505/Screenshot_2025-07-27_215345_ft1z5v.png"
          alt="Croissant"
          className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-cover rounded-full drop-shadow-2xl"
        />
      </div>
    </section>
  );
}
