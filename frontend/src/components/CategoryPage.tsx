import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/foodRoute")
      .then(res => {
        const filtered = res.data.filter(
          (item: any) => item.category === categoryName
        );
        setItems(filtered);
      });
  }, [categoryName]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Category: {categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <span className="text-green-600 font-bold">₹{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
