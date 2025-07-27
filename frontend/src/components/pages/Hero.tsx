export default function Hero() {
  return (
    <section className="bg-[#f8f8f8] w-full min-h-screen px-6 py-12 flex flex-col md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="md:w-1/2 space-y-6">
        <p className="text-gray-600 uppercase tracking-wider text-sm">Welcome to our restaurant</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Delightful Dining <br />
          Nourishing Nutrients <br />
          and delicious food.
        </h1>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">Order now</button>
          <button className="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition">Reservation</button>
        </div>
      </div>

      {/* Right Croissant Image */}
      <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
        <img
          src="https://res.cloudinary.com/dykahal7o/image/upload/v1753633505/Screenshot_2025-07-27_215345_ft1z5v.png" // Make sure this is a transparent PNG
          alt="Croissant"
          className="w-96 h-96 md:w-[450px]  object-cover rounded-full drop-shadow-2xl"
        />
      </div>
    </section>
  );
}
