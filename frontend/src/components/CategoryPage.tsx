import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [items, setItems] = useState([]);

const categoryImages: { [key: string]: string } = {
  Pzza: "https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg",
  NonVeg: "https://res.cloudinary.com/dykahal7o/image/upload/v1753548026/Screenshot_2025-07-26_221011_avpfas.png",
  Veg: "https://res.cloudinary.com/dykahal7o/image/upload/v1753728673/Screenshot_2025-07-29_002104_cfgebm.png",
  // Add more categories as needed
};

  // replace the banner img src with a dynamic category image if needed.

  useEffect(() => {
    axios.get("http://localhost:8080/foodRoute").then((res) => {
      const filtered = res.data.filter(
        (item: any) => item.category === categoryName
      );
      setItems(filtered);
    });
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[300px] w-full mb-10">
        <img
          src={categoryImages[categoryName || ""] || "https://res.cloudinary.com/dykahal7o/image/upload/v1753548026/Screenshot_2025-07-26_221011_avpfas.png"}
          alt="Banner"
          className="w-full h-full object-cover rounded-b-xl"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-b-xl flex flex-col justify-center px-10 text-white">
          <p className="text-sm uppercase">Food Collections</p>
          <h1 className="text-4xl font-bold mb-2">Insta-worthy Spots</h1>
          <p className="max-w-lg">
            We've picked out the best Instagrammable cafes to help you build a
            picture-perfect feed. After all, our phones eat first!
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="px-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Category: {categoryName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-xs text-green-700 font-bold mb-1">
                  4.2 ★ DINING
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {item.description}
                </p>
                <p className="text-sm text-gray-700 mt-1 font-semibold">
                  ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};




export default CategoryPage;
