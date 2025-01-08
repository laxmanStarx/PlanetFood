import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface MenuItem {
  id: string;
  image:string;
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{<img
  src={item.image} // Dynamically set the image URL
  alt={item.name}
  className="w-full h-48 object-cover"
/>}</h2>
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-lg font-bold text-gray-800">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
