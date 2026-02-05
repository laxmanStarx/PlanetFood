

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">About foodStarX</h1>
      
      <div className="bg-green-50 p-8 rounded-2xl mb-12 text-center">
        <p className="text-xl italic">"Delightful Dining, Nourishing Nutrients & Delicious Food."</p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-600">Our Story</h2>
        <p className="leading-relaxed">
          Launched in 2024, foodStarX was born out of a desire to bridge the gap between 
          premium restaurant quality and the convenience of home delivery. We curate 
          the best local eateries to ensure that every meal you order is a "Star" meal.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2">Our Vision</h3>
          <p>To become the world's most loved food destination by focusing on nutrition and taste.</p>
        </div>
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg mb-2">Our Promise</h3>
          <p>Fresh ingredients, transparent pricing, and a delivery experience that never lets you down.</p>

        </div>
        <div className="flex justify-center mx-5 gap-8">
       <h2 className="  text-center text-2xl font-bold mb-2">Our Phone number</h2>
        <span className=" text-2xl ">629999999</span>
        </div>

      </div>
    </div>
  );
}

export default About