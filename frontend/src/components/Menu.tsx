import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface MenuItem {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
}

const Menu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:8080/menu/${restaurantId}`);
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>
      <div className="w-full md:w-3/4 lg:w-2/3 divide-y divide-gray-300">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center md:items-start py-6 space-y-4 md:space-y-0"
          >
            {/* Food Description */}
            <div className="flex-1 text-left md:pr-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{item.name}</h2>
              <p className="text-gray-600 mt-2">{item.description}</p>
              <p className="text-lg font-bold text-gray-800 mt-4">${item.price.toFixed(2)}</p>
            </div>
            {/* Food Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 object-cover border border-gray-200 rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
